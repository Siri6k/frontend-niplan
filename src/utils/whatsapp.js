const FALLBACK_PHONE = "243899530506";

export const normalizeWhatsAppPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits || FALLBACK_PHONE;
};

export const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "0";
  return number.toLocaleString();
};

export const buildListingWhatsAppMessage = (
  listing,
  currentUrl = window.location.href,
  details = false,
) => {
  const title = listing?.title || listing?.name || "cet article";
  const price = listing?.price
    ? `${formatPrice(listing.price)} ${listing.currency || ""}`.trim()
    : "";
  const mainImage = listing?.main_image || listing?.images?.[0]?.image;
  const url = mainImage || `${currentUrl}${details ? `/${listing.slug}` : ""}`;
  return [
    `Bonjour, je suis interesse par votre article "${title}" sur Niplan.`,
    price ? `Prix: ${price}` : null,
    "",
    "Est-il toujours disponible ?",
    `${url}`,
  ]
    .filter(Boolean)
    .join("\n");
};

export const buildBusinessWhatsAppMessage = (
  business,
  currentUrl = window.location.href,
) => {
  return [
    `Bonjour, je viens de voir votre boutique ${business?.name || "Niplan"} sur Niplan.`,
    `Lien: ${currentUrl}`,
    "",
    "Je voudrais avoir plus d'informations.",
  ].join("\n");
};

export const openWhatsApp = (phone, message) => {
  const normalizedPhone = normalizeWhatsAppPhone(phone);
  const url = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
