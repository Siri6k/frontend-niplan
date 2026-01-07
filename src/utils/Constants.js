export const normalizedPhoneNumber = (phone_number) => {
  // Keep the + if present, then remove all other non-digit characters
  const hasPlus = phone_number.startsWith("+");
  let rawPhone = phone_number.replace(hasPlus ? /[^\d+]/g : /\D/g, "");

  // Handle local numbers (starting with 0 or without country code)
  if (rawPhone.startsWith("0")) {
    return "+243" + rawPhone.slice(1);
  } else if (!hasPlus && rawPhone.length > 0) {
    // For numbers without any prefix, assume it's Congo number
    return "+243" + rawPhone;
  }
  // For numbers with +, return as is (only digits and +)
  return rawPhone;
};
