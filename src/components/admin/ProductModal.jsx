import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CATEGORIES  = ["shirt", "pant"];
const ALL_SIZES   = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];

const BLANK = {
  name: "", brand: "", category: "shirt",
  price: "", salePrice: "", image: "",
  sizes: [], rating: "4.8", featured: false,
};

const inputCls =
  "w-full rounded-xl border border-line bg-ink px-4 py-2.5 text-sm text-cream " +
  "placeholder:text-muted outline-none transition-colors focus:border-brand/50";

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-muted">
        {label}{required && <span className="ml-1 text-brand">*</span>}
      </label>
      {children}
    </div>
  );
}

export default function ProductModal({ product, onClose, onSave }) {
  const [form, setForm]     = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (product) {
      const sizes = Array.isArray(product.sizes)
        ? product.sizes
        : typeof product.sizes === "string"
          ? product.sizes.split(",").map((s) => s.trim()).filter(Boolean)
          : [];
      setForm({
        name:      product.name ?? "",
        brand:     product.brand ?? "",
        category:  product.category ?? "shirt",
        price:     product.price != null ? String(product.price) : "",
        salePrice: product.salePrice != null ? String(product.salePrice) : "",
        image:     product.image ?? "",
        sizes,
        rating:    product.rating != null ? String(product.rating) : "4.8",
        featured:  Boolean(product.featured),
      });
    } else {
      setForm(BLANK);
    }
    setError(null);
  }, [product]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleSize = (s) =>
    set("sizes", form.sizes.includes(s)
      ? form.sizes.filter((x) => x !== s)
      : [...form.sizes, s]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim())              return setError("Product name is required.");
    if (!form.price || isNaN(+form.price)) return setError("A valid price is required.");
    setError(null);
    setSaving(true);
    try {
      await onSave({
        name:      form.name.trim(),
        brand:     form.brand.trim(),
        category:  form.category,
        price:     Number(form.price),
        salePrice: form.salePrice !== "" ? Number(form.salePrice) : null,
        image:     form.image.trim() || null,
        sizes:     form.sizes,
        rating:    Number(form.rating) || 4.8,
        featured:  form.featured,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-bold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted transition-colors hover:bg-card hover:text-cream"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable form body */}
        <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            {error && (
              <div className="rounded-xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">
                {error}
              </div>
            )}

            {/* Name + Brand */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Product Name" required>
                <input
                  className={inputCls}
                  placeholder="e.g. Stage-Worn Tour Tee"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </Field>
              <Field label="Brand">
                <input
                  className={inputCls}
                  placeholder="e.g. Artist Archive"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                />
              </Field>
            </div>

            {/* Category + Price + Sale */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Category">
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  style={{ background: "#0a0a0c" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#101013" }}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Price (₦)" required>
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                />
              </Field>
              <Field label="Sale Price (₦)">
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Optional"
                  value={form.salePrice}
                  onChange={(e) => set("salePrice", e.target.value)}
                />
              </Field>
            </div>

            {/* Image URL */}
            <Field label="Image URL">
              <input
                className={inputCls}
                placeholder="https://..."
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
              />
            </Field>

            {/* Rating + Featured */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Rating (0 – 5)">
                <input
                  className={inputCls}
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  placeholder="4.8"
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                />
              </Field>
              <Field label="Featured">
                <div className="flex items-center gap-3 pt-2.5">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.featured}
                    onClick={() => set("featured", !form.featured)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      form.featured ? "bg-brand" : "bg-card-2"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                        form.featured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                  <span className="text-sm text-muted">
                    {form.featured ? "Featured on homepage" : "Not featured"}
                  </span>
                </div>
              </Field>
            </div>

            {/* Sizes */}
            <Field label="Available Sizes">
              <div className="mt-1 flex flex-wrap gap-2">
                {ALL_SIZES.map((s) => {
                  const active = form.sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                        active
                          ? "border-brand bg-brand/15 text-brand"
                          : "border-line bg-card text-muted hover:border-brand/40 hover:text-cream"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-card hover:text-cream"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-brand py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving…" : product ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
