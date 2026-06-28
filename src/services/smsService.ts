export const maskPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  const local = digits.startsWith("234")
    ? digits.slice(3)
    : digits.replace(/^0/, "");
  const last4 = local.slice(-4);
  return `+234 *** *** ${last4}`;
};

export const sendPhoneOtpSms = async (
  phone: string,
  code: string,
): Promise<{ mocked: boolean }> => {
  // console only for now
  console.log(`[SMS MOCK] To: ${phone} | OTP: ${code}`);
  return { mocked: true };
};
