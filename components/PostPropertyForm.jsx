"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "./Icon";
import Reveal from "./Reveal";
import RequireLogin from "./RequireLogin";
import {
  BHK_OPTIONS,
  BATHROOMS,
  FURNISHING,
  POSSESSION,
  SALE_TYPES,
  FACINGS,
  AMENITIES,
  APPROVAL_AUTHORITIES,
  DIET,
  OCCUPANCY,
  FOOD,
  PG_AMENITIES,
  PROFESSION,
  NEARBY_CATEGORIES,
} from "@/lib/options";
import { createProperty, updateProperty, fetchRawProperties, refreshListings } from "@/lib/appApi";
import { API, SITE } from "@/lib/site";

// Same three steps as the app's "Add Property" (property_type.dart →
// add_*_details.dart → upload_images.dart), posting to the same API.
const STEPS = ["Property", "Details", "Photos & Publish"];
const RES_TYPES = ["Flat", "House", "Villa", "Plot"];
const COM_TYPES = ["Office Space", "Shop", "Showroom", "Commercial"];
const POSTED_BY = ["Owner", "Builder"];
const MAX_MB = 10;
// Conversions used by the app
const SQM_TO_SQFT = 10.7639;
const ACRE_TO_SQFT = 44071.83;
const KUNTE_TO_SQFT = 1089;

const EMPTY = {
  want: "",
  lease: "Rent",
  property: "",
  sub: "",
  occupancy: [],
  food: "",
  pgAmenities: [],
  profession: [],
  saleType: "",
  sellerType: "Owner",
  facing: "",
  unit: "Feet",
  len: "",
  wid: "",
  acre: "",
  kunte: "",
  city: "",
  address: "",
  landmark: "",
  lat: "",
  lng: "",
  bedrooms: "",
  bathrooms: "",
  furnishing: "",
  floor: "",
  possession: "",
  diet: "",
  approval: "Others",
  rera: "No",
  reraNo: "",
  amenities: [],
  seats: "",
  price: "",
  token: "",
  nearby: [],
};

const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
const trimNum = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
const imageUrl = (src) => (/^https?:\/\//.test(src) ? src : `${API.images}/${String(src).replace(/^\/?public\/?/i, "").replace(/^\//, "")}`);

// Price in words, like the app's helper under "Price you expect"
function inWords(n) {
  n = Math.floor(Number(n) || 0);
  if (!n) return "Zero Rupees";
  const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const two = (x) => (x < 20 ? a[x] : `${b[Math.floor(x / 10)]}${x % 10 ? ` ${a[x % 10]}` : ""}`);
  const three = (x) => (x >= 100 ? `${a[Math.floor(x / 100)]} Hundred${x % 100 ? ` ${two(x % 100)}` : ""}` : two(x));
  const parts = [];
  const cr = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const th = Math.floor((n % 1e5) / 1e3);
  const rest = n % 1e3;
  if (cr) parts.push(`${three(cr)} Crore`);
  if (lakh) parts.push(`${two(lakh)} Lakh`);
  if (th) parts.push(`${two(th)} Thousand`);
  if (rest) parts.push(three(rest));
  return `${parts.join(" ")} Rupees`;
}

// An API record → this form's state (Dashboard → Edit)
function fromRecord(r) {
  const pg = r.type === "PG" || /pg/i.test(r.propertytype || "");
  const agri = /agri/i.test(`${r.propertytype || ""} ${r.commercialtype || ""}`);
  const dims = String(r.Dimensions || "").match(/([\d.]+)\s*x\s*([\d.]+)\s*(ft|m)?/i);
  const names = (r.amenities || []).map((a) => a.name || a).filter(Boolean);
  return {
    ...EMPTY,
    want: pg ? "PG" : r.type === "Sell" ? "Sell" : "Rent/Lease",
    lease: r.type === "Lease" ? "Lease" : "Rent",
    property: pg ? r.propertytype : agri ? "Agricultural Land" : r.propertytype || "",
    sub: agri ? "" : r.residentialtype || r.commercialtype || "",
    occupancy: (r.occupancy_type || r.occupayname || []).map((o) => o.occupayname || o).filter((x) => typeof x === "string"),
    food: r.food_provided || "",
    pgAmenities: pg ? names : [],
    profession: r.profession_Type || [],
    saleType: r.saletype || "",
    sellerType: r.sellertype === "Builder" ? "Builder" : "Owner",
    facing: r.Facing || "",
    unit: dims?.[3]?.toLowerCase() === "m" ? "Meters" : "Feet",
    len: dims?.[1] || "",
    wid: dims?.[2] || "",
    acre: r.acre || "",
    kunte: r.kunte || "",
    city: (r.city || "").trim(),
    address: (r.address || "").trim(),
    landmark: (r.landmark || "").trim(),
    lat: Number(r.googleaddress?.lat) ? r.googleaddress.lat : "",
    lng: Number(r.googleaddress?.long) ? r.googleaddress.long : "",
    bedrooms: r.bedrooms || "",
    bathrooms: r.bathrooms || "",
    furnishing: r.furnishing || "",
    floor: r.floor_no || "",
    possession: r.possessionstatus || "",
    diet: r.diet || "",
    approval: r.approvalauthority || "Others",
    rera: r.reraregistered ? "Yes" : "No",
    amenities: pg ? [] : names,
    seats: r.seats ? String(r.seats) : "",
    price: String(r.expect_price || "").replace(/\D/g, ""),
    token: String(r.booking_tokenamount || "").replace(/\D/g, ""),
    nearby: (r.nearbyplace || []).map((n) => ({ category: n.category, name: n.place_name, distance: n.distance })),
  };
}

function Choice({ label, options, value, onChange, multi = false, required = false }) {
  return (
    <div className="pf-group">
      <p className="pf-label">
        {label}
        {required && <em>*</em>}
      </p>
      <div className="chips">
        {options.map((o) => {
          const on = multi ? value.includes(o) : value === o;
          return (
            <motion.button key={o} type="button" whileTap={{ scale: 0.94 }} className={`chip ${on ? "on" : ""}`} aria-pressed={on} onClick={() => onChange(multi ? toggleIn(value, o) : on ? "" : o)}>
              {o}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Sections slide in one after another as each answer is given, like the app
const Appear = ({ show, children }) => (
  <AnimatePresence initial={false}>
    {show && (
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: "hidden" }}>
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

function Form({ user }) {
  const params = useSearchParams();
  const editId = params.get("edit");
  const [step, setStep] = useState(0);
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]); // new File objects
  const [kept, setKept] = useState([]); // server image paths kept (edit)
  const [loading, setLoading] = useState(!!editId);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [apiError, setApiError] = useState("");
  const [locating, setLocating] = useState(false);
  const [place, setPlace] = useState({ category: NEARBY_CATEGORIES[0], name: "", distance: "" });
  const set = (patch) => setF((s) => ({ ...s, ...patch }));
  const input = (k) => ({ value: f[k], onChange: (e) => set({ [k]: e.target.value }) });

  // Edit: load the property and check it belongs to this account
  useEffect(() => {
    if (!editId) return;
    fetchRawProperties()
      .then((all) => {
        const r = all.find((x) => x._id === editId);
        if (!r) throw new Error("This property could not be found.");
        if (r.customerId !== user.id) throw new Error("You can only edit properties you posted.");
        setF(fromRecord(r));
        setKept(r.propertyimage || []);
      })
      .catch((err) => setApiError(err.message))
      .finally(() => setLoading(false));
  }, [editId, user.id]);

  const previews = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(() => () => previews.forEach((p) => URL.revokeObjectURL(p.url)), [previews]);

  const isPg = f.want === "PG";
  const isAgri = f.property === "Agricultural Land";
  const isRes = f.property === "Residential";
  const isCom = f.property === "Commercial";
  const isPlot = f.sub === "Plot";
  const homeLike = isRes && !isPlot;
  const area = f.len && f.wid ? Number(f.len) * Number(f.wid) * (f.unit === "Meters" ? SQM_TO_SQFT : 1) : 0;
  const agriArea = (Number(f.acre) || 0) * ACRE_TO_SQFT + (Number(f.kunte) || 0) * KUNTE_TO_SQFT;
  const typeDone = isPg ? f.property && f.occupancy.length > 0 : isAgri || ((isRes || isCom) && f.sub);

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!f.want) e.want = "Choose Sell, Rent/Lease or PG";
      else if (!f.property) e.property = "Choose the property";
      else if (!typeDone) e.sub = isPg ? "Choose the occupancy type" : "Choose the type";
      if (!isPg && typeDone && !f.saleType) e.saleType = "Choose the sale type";
      if (!isPg && typeDone && !f.facing) e.facing = "Choose the facing";
      if (!f.city.trim()) e.city = "Enter City";
      if (!f.address.trim()) e.address = "Enter Full Address";
    }
    if (s === 1) {
      if (!(Number(f.price) > 0)) e.price = "Please enter a valid price";
      if (homeLike && !f.bedrooms) e.bedrooms = "Choose bedrooms";
      if (f.rera === "Yes" && !f.reraNo.trim() && !editId) e.reraNo = "Please enter the RERA number";
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (!validate(step)) return;
    setStep((s) => s + 1);
    window.__lenis?.scrollTo(".post-card", { offset: -110 });
  };

  const addPlace = () => {
    if (!place.name.trim()) return;
    set({ nearby: [...f.nearby, { ...place, name: place.name.trim() }] });
    setPlace({ category: NEARBY_CATEGORIES[0], name: "", distance: "" });
  };

  const addFiles = (list) => {
    setApiError("");
    const ok = [];
    for (const file of list) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_MB * 1024 * 1024) {
        setApiError(`Image too large: ${file.name} is over ${MAX_MB} MB.`);
        continue;
      }
      ok.push(file);
    }
    setFiles((fs) => [...fs, ...ok]);
  };

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        set({ lat: String(coords.latitude), lng: String(coords.longitude) });
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  };

  // The app's SellModel.toJson()
  const payload = () => {
    const type = f.want === "Rent/Lease" ? f.lease : f.want;
    const amenities = (isPg ? f.pgAmenities : f.amenities).map((name) => ({ name }));
    const base = {
      propertytype: isPg ? f.property : isAgri ? "Commercial" : f.property,
      type,
      sellertype: f.sellerType,
      city: f.city.trim(),
      address: f.address.trim(),
      landmark: f.landmark.trim(),
      googleaddress: { lat: f.lat || "0.0", long: f.lng || "0.0" },
      customerId: user.id,
      customerName: user.userName,
      customerNumber: user.phone,
      expect_price: f.price,
      booking_tokenamount: f.token,
      nearbyplace: f.nearby.map((n) => ({ category: n.category, place_name: n.name, distance: n.distance || "" })),
      amenities,
    };
    if (isPg)
      return {
        ...base,
        occupayname: f.occupancy.map((o) => ({ occupayname: o })),
        food_provided: f.food,
        profession_Type: f.profession,
      };
    const common = { ...base, saletype: f.saleType, Facing: f.facing };
    if (isAgri)
      return {
        ...common,
        commercialtype: "Agricultural Land",
        acre: f.acre,
        kunte: f.kunte,
        totalarea: agriArea ? trimNum(agriArea) : "",
      };
    const withArea = {
      ...common,
      Dimensions: f.len && f.wid ? `${f.len} x ${f.wid} ${f.unit === "Meters" ? "m" : "ft"}` : "",
      totalarea: area ? trimNum(area) : "",
    };
    if (isCom)
      return {
        ...withArea,
        commercialtype: f.sub,
        furnishing: f.furnishing,
        floor_no: f.floor,
        seats: f.sub === "Office Space" && f.seats ? Number(f.seats) : undefined,
      };
    if (isPlot) return { ...withArea, residentialtype: "Plot", approvalauthority: f.approval };
    return {
      ...withArea,
      residentialtype: f.sub,
      bedrooms: f.bedrooms,
      bathrooms: f.bathrooms,
      furnishing: f.furnishing,
      floor_no: f.floor,
      possessionstatus: f.possession,
      diet: f.diet,
      approvalauthority: f.approval,
      reraregistered: f.rera === "Yes",
    };
  };

  const publish = async () => {
    setApiError("");
    setBusy(true);
    try {
      if (editId) await updateProperty(editId, payload(), files, kept);
      else await createProperty(payload(), files);
      refreshListings();
      setDone(true);
      window.__lenis?.scrollTo(".post-card", { offset: -110 });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="loading-rows" aria-busy="true"><span /><span /></div>;

  if (done)
    return (
      <motion.div className="post-done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <motion.span className="post-done-icon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.1 }}>
          <Icon name="check" size={44} strokeWidth={3} />
        </motion.span>
        <h2>{editId ? "Property Updated Successfully!" : "Property Added Successfully!"}</h2>
        <p>
          {editId
            ? "Your changes are saved — in the app too."
            : "Your property is now in your Dashboard and in the app. It shows up in search once it's approved."}
        </p>
        <div className="post-done-actions">
          <Link href="/dashboard" className="btn btn-green">
            <Icon name="dashboard" size={18} /> Go to Dashboard
          </Link>
          {!editId && (
            <button
              className="btn btn-outline"
              onClick={() => {
                setF(EMPTY);
                setFiles([]);
                setStep(0);
                setDone(false);
              }}
            >
              Post another
            </button>
          )}
        </div>
      </motion.div>
    );

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate>
      <ol className="steps-bar">
        {STEPS.map((s, i) => (
          <li key={s} className={i === step ? "on" : i < step ? "done" : ""}>
            <span>{i < step ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}</span>
            {s}
          </li>
        ))}
        <motion.i className="steps-fill" animate={{ scaleX: step / (STEPS.length - 1) }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          {step === 0 && (
            <>
              <h2 className="pf-title">{editId ? "Edit Property" : "Add Property"}</h2>
              <Choice label="I want to" required options={["Sell", "Rent/Lease", "PG"]} value={f.want} onChange={(want) => set({ want, property: "", sub: "", occupancy: [] })} />
              {errors.want && <p className="form-error">{errors.want}</p>}
              <Appear show={f.want === "Rent/Lease"}>
                <Choice label="Type" options={["Rent", "Lease"]} value={f.lease} onChange={(lease) => set({ lease: lease || "Rent" })} />
              </Appear>
              <Appear show={!!f.want}>
                <Choice
                  label="Property"
                  required
                  options={isPg ? ["Boys PG", "Girls PG", "Co-Living PG"] : ["Residential", "Commercial", "Agricultural Land"]}
                  value={f.property}
                  onChange={(property) => set({ property, sub: "" })}
                />
                {errors.property && <p className="form-error">{errors.property}</p>}
              </Appear>
              <Appear show={isRes}>
                <Choice label="Residential Type" required options={RES_TYPES} value={f.sub} onChange={(sub) => set({ sub })} />
              </Appear>
              <Appear show={isCom}>
                <Choice label="Commercial Type" required options={COM_TYPES} value={f.sub} onChange={(sub) => set({ sub })} />
              </Appear>
              <Appear show={isPg && !!f.property}>
                <Choice label="Occupancy Type" required multi options={OCCUPANCY} value={f.occupancy} onChange={(occupancy) => set({ occupancy })} />
                <Choice label="Food Provided" options={FOOD} value={f.food} onChange={(food) => set({ food })} />
                <Choice label="Amenities" multi options={PG_AMENITIES} value={f.pgAmenities} onChange={(pgAmenities) => set({ pgAmenities })} />
                <Choice label="Profession Type" multi options={PROFESSION} value={f.profession} onChange={(profession) => set({ profession })} />
              </Appear>
              {errors.sub && <p className="form-error">{errors.sub}</p>}

              <Appear show={!!typeDone}>
                {!isPg && (
                  <>
                    <Choice label="Sale Type" required options={SALE_TYPES} value={f.saleType} onChange={(saleType) => set({ saleType })} />
                    {errors.saleType && <p className="form-error">{errors.saleType}</p>}
                  </>
                )}
                <Choice label="Posted by" required options={POSTED_BY} value={f.sellerType} onChange={(sellerType) => set({ sellerType: sellerType || "Owner" })} />
                {!isPg && (
                  <>
                    <Choice label="Facing" required options={FACINGS} value={f.facing} onChange={(facing) => set({ facing })} />
                    {errors.facing && <p className="form-error">{errors.facing}</p>}
                  </>
                )}

                {isAgri ? (
                  <div className="pf-group">
                    <p className="pf-label">Covered Area</p>
                    <div className="pf-row">
                      <label className="field">
                        <span>Acre</span>
                        <input inputMode="decimal" {...input("acre")} placeholder="e.g. 2" />
                      </label>
                      <label className="field">
                        <span>Kunte / Gunta</span>
                        <input inputMode="decimal" {...input("kunte")} placeholder="e.g. 10" />
                      </label>
                    </div>
                    {agriArea > 0 && (
                      <p className="pf-total">
                        Total Area (in sqft): <b>{Math.round(agriArea).toLocaleString("en-IN")}</b>
                      </p>
                    )}
                  </div>
                ) : (
                  !isPg && (
                    <div className="pf-group">
                      <p className="pf-label">Property Area</p>
                      <div className="mini-seg">
                        {["Feet", "Meters"].map((u) => (
                          <button key={u} type="button" className={f.unit === u ? "on" : ""} onClick={() => set({ unit: u })}>
                            {u}
                          </button>
                        ))}
                      </div>
                      <div className="pf-row pf-dims">
                        <label className="field">
                          <span>Length</span>
                          <input inputMode="decimal" {...input("len")} placeholder={f.unit === "Feet" ? "ft (eg. 30)" : "m (eg. 9)"} />
                        </label>
                        <span className="pf-x">×</span>
                        <label className="field">
                          <span>Breadth</span>
                          <input inputMode="decimal" {...input("wid")} placeholder={f.unit === "Feet" ? "ft (eg. 40)" : "m (eg. 12)"} />
                        </label>
                      </div>
                      <AnimatePresence>
                        {area > 0 && (
                          <motion.p className="pf-total" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                            Total Area (in sqft): <b>{Math.round(area).toLocaleString("en-IN")}</b>
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                )}
              </Appear>

              <div className="pf-group">
                <p className="pf-label">Property Location</p>
                <label className="field">
                  <span>Enter City*</span>
                  <input {...input("city")} placeholder="e.g. Mysore" autoComplete="address-level2" />
                  {errors.city && <em className="field-err">{errors.city}</em>}
                </label>
                <label className="field">
                  <span>Enter Full Address*</span>
                  <textarea rows={2} {...input("address")} placeholder="Door no., street, area" />
                  {errors.address && <em className="field-err">{errors.address}</em>}
                </label>
                <label className="field">
                  <span>Landmark</span>
                  <input {...input("landmark")} placeholder="e.g. Near TVS factory" />
                </label>
                <div className="pf-locate">
                  <button type="button" className="btn btn-outline btn-sm" onClick={locate} disabled={locating}>
                    <Icon name="target" size={16} /> {locating ? "Locating…" : f.lat ? "Update location" : "Use my current location (optional)"}
                  </button>
                  {f.lat && (
                    <span className="pf-located">
                      <Icon name="check" size={14} strokeWidth={3} /> Location pinned
                      <button type="button" className="link-btn" onClick={() => set({ lat: "", lng: "" })}>
                        Remove
                      </button>
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <h2 className="pf-title">{isPg ? f.property : f.sub || f.property} details</h2>
              {homeLike && (
                <>
                  <Choice label="Bedrooms" required options={BHK_OPTIONS.map((b) => b.label)} value={f.bedrooms} onChange={(bedrooms) => set({ bedrooms })} />
                  {errors.bedrooms && <p className="form-error">{errors.bedrooms}</p>}
                  <Choice label="Bathrooms" options={BATHROOMS.map(String)} value={f.bathrooms} onChange={(bathrooms) => set({ bathrooms })} />
                </>
              )}
              {isCom && f.sub === "Office Space" && (
                <label className="field">
                  <span>No. of sites</span>
                  <input inputMode="numeric" {...input("seats")} />
                </label>
              )}
              {(homeLike || isCom) && <Choice label="Furnishing" options={FURNISHING} value={f.furnishing} onChange={(furnishing) => set({ furnishing })} />}
              {(homeLike || isCom) && (
                <label className="field">
                  <span>Floor No.</span>
                  <input {...input("floor")} placeholder="Enter Floor Details" />
                </label>
              )}
              {homeLike && <Choice label="Possession Status" options={POSSESSION} value={f.possession} onChange={(possession) => set({ possession })} />}
              {homeLike && f.want === "Rent/Lease" && <Choice label="Diet" options={DIET} value={f.diet} onChange={(diet) => set({ diet })} />}
              {(homeLike || isPlot) && (
                <Choice label="Approval Authority" options={[...APPROVAL_AUTHORITIES, "Others"]} value={f.approval} onChange={(approval) => set({ approval: approval || "Others" })} />
              )}
              {homeLike && (
                <>
                  <Choice label="Is your property RERA registered?" options={["Yes", "No"]} value={f.rera} onChange={(rera) => set({ rera: rera || "No" })} />
                  <Appear show={f.rera === "Yes" && !editId}>
                    <label className="field">
                      <span>Enter RERA Number</span>
                      <input {...input("reraNo")} />
                      {errors.reraNo && <em className="field-err">{errors.reraNo}</em>}
                    </label>
                  </Appear>
                </>
              )}
              {(homeLike || isCom) && <Choice label="Amenities" multi options={AMENITIES} value={f.amenities} onChange={(amenities) => set({ amenities })} />}

              <div className="pf-group">
                <label className="field">
                  <span>Price you expect*</span>
                  <div className="field-prefix">
                    <em>₹</em>
                    <input inputMode="numeric" value={f.price} onChange={(e) => set({ price: e.target.value.replace(/\D/g, "") })} />
                  </div>
                  <small className="pf-words">{inWords(f.price)}</small>
                  {errors.price && <em className="field-err">{errors.price}</em>}
                </label>
                <label className="field">
                  <span>Booking/Token Amount</span>
                  <div className="field-prefix">
                    <em>₹</em>
                    <input inputMode="numeric" value={f.token} onChange={(e) => set({ token: e.target.value.replace(/\D/g, "") })} placeholder="500" />
                  </div>
                </label>
              </div>

              <div className="pf-group">
                <p className="pf-label">Nearby places (optional)</p>
                {f.nearby.length > 0 && (
                  <ul className="pf-near">
                    {f.nearby.map((n, i) => (
                      <motion.li key={n.name + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <Icon name="compass" size={16} />
                        <span>
                          <b>{n.name}</b> {n.category}
                          {n.distance && ` • ${n.distance} KM`}
                        </span>
                        <button type="button" aria-label={`Remove ${n.name}`} onClick={() => set({ nearby: f.nearby.filter((_, j) => j !== i) })}>
                          <Icon name="close" size={14} />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
                <div className="pf-near-add">
                  <select value={place.category} onChange={(e) => setPlace((p) => ({ ...p, category: e.target.value }))} aria-label="Category">
                    {NEARBY_CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <input value={place.name} onChange={(e) => setPlace((p) => ({ ...p, name: e.target.value }))} placeholder="Place Name (e.g., Green Line Metro)" aria-label="Place name" />
                  <input value={place.distance} onChange={(e) => setPlace((p) => ({ ...p, distance: e.target.value }))} inputMode="decimal" placeholder="Distance in km (e.g., 1.2)" aria-label="Distance in km" />
                  <button type="button" className="btn btn-outline" onClick={addPlace}>
                    <Icon name="plus" size={16} /> Add Place
                  </button>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="pf-title">Image Upload</h2>
              <label
                className="pf-drop"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  addFiles([...e.dataTransfer.files]);
                }}
              >
                <input type="file" accept="image/*" multiple onChange={(e) => (addFiles([...e.target.files]), (e.target.value = ""))} />
                <Icon name="upload" size={30} />
                <b>Upload Images</b>
                <small>Click or drop photos here · up to {MAX_MB} MB each</small>
              </label>
              {kept.length + files.length === 0 ? (
                <p className="muted pf-none">No images selected (optional — you can publish without photos)</p>
              ) : (
                <>
                  {kept.length > 0 && <p className="pf-label">Current images</p>}
                  <div className="pf-thumbs">
                    {kept.map((src) => (
                      <span key={src} className="pf-thumb">
                        <img src={imageUrl(src)} alt="" />
                        <button type="button" aria-label="Remove image" onClick={() => setKept((k) => k.filter((x) => x !== src))}>
                          <Icon name="close" size={14} strokeWidth={2.6} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {files.length > 0 && editId && <p className="pf-label">New images</p>}
                  <div className="pf-thumbs">
                    {previews.map((p, i) => (
                      <motion.span key={p.url} className="pf-thumb" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                        <img src={p.url} alt="" />
                        <button type="button" aria-label="Remove image" onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}>
                          <Icon name="close" size={14} strokeWidth={2.6} />
                        </button>
                      </motion.span>
                    ))}
                  </div>
                </>
              )}
              <div className="pf-summary">
                <Icon name="user" size={18} />
                <span>
                  Posting as <b>{user.userName}</b> · +91 {user.phone}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {apiError && <p className="form-error pf-api-error">{apiError}</p>}

      <div className="post-actions">
        {step > 0 && (
          <button type="button" className="btn btn-outline" onClick={() => setStep((s) => s - 1)} disabled={busy}>
            <Icon name="back" size={18} /> Back
          </button>
        )}
        {step < 2 ? (
          <button type="button" className="btn btn-green" onClick={next}>
            Next <Icon name="arrow" size={18} />
          </button>
        ) : (
          <button type="button" className="btn btn-green" onClick={publish} disabled={busy}>
            {busy ? (editId ? "Saving…" : "Publishing…") : editId ? "Save changes" : "Publish"}
          </button>
        )}
      </div>
    </form>
  );
}

export default function PostPropertyForm() {
  return (
    <section className="section post">
      <div className="container post-grid">
        <Reveal className="post-card">
          <RequireLogin title="Login to post your property" text="Use the same phone number as the app — your listing and its enquiries show up in both.">
            {(user) => <Form user={user} />}
          </RequireLogin>
        </Reveal>

        <aside className="post-aside">
          <Reveal delay={0.1} className="post-app">
            <img src="/brand/logo-light.png" alt="" />
            <h3>Same account as the app</h3>
            <p>Properties you post here appear in the Thirty Forty app, and every enquiry reaches you as a notification and in your Dashboard.</p>
            <a className="btn btn-yellow btn-block" href={SITE.playStore} target="_blank" rel="noopener noreferrer">
              <Icon name="playFilled" size={18} /> Get it on Google Play
            </a>
          </Reveal>
          <Reveal delay={0.15}>
            <h3>Why post on Thirty Forty</h3>
            <ul>
              {[
                ["sparkle", "Posting is free"],
                ["bell", "Instant notification for every enquiry"],
                ["chat", "Buyers and tenants reach you on WhatsApp"],
                ["dashboard", "Manage listings from your Dashboard"],
                ["crown", "Go Premium for top placement"],
              ].map(([icon, t]) => (
                <li key={t}>
                  <span className="why-icon sm">
                    <Icon name={icon} size={20} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </aside>
      </div>
    </section>
  );
}
