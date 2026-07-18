export type ContactValidationInput = {
  name?: unknown;
  companyName?: unknown;
  email?: unknown;
  phone?: unknown;
  service?: unknown;
  message?: unknown;
  locale?: unknown;
};

export type ValidContactSubmission = {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  locale: 'en' | 'fa';
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactSubmission(input: ContactValidationInput):
  | {ok: true; data: ValidContactSubmission}
  | {ok: false; error: string} {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const companyName = typeof input.companyName === 'string' ? input.companyName.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  const service = typeof input.service === 'string' ? input.service.trim() : '';
  const message = typeof input.message === 'string' ? input.message.trim() : '';
  const locale = input.locale === 'fa' ? 'fa' : 'en';

  if (!name) return {ok: false, error: 'Name is required'};
  if (email && !emailPattern.test(email)) return {ok: false, error: 'Valid email is required'};
  if (message.length < 20) return {ok: false, error: 'Message must be at least 20 characters'};

  return {
    ok: true,
    data: {name, companyName, email, phone, service, message, locale}
  };
}
