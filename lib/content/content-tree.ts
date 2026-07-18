import {getDefaultContent} from '@/lib/content/utils';

export type ContentSectionId =
  | 'hero'
  | 'services'
  | 'about'
  | 'headlines'
  | 'contact';

export interface ContentFieldDef {
  id: string;
  section: ContentSectionId;
  labelEn: string;
  labelFa: string;
  root: 'site' | 'pages';
  pathFa: string;
  pathEn: string;
  type: 'bilingual' | 'single';
}

const {site, pages} = getDefaultContent();

const fields: ContentFieldDef[] = [];

const heroKeys = [
  'eyebrow',
  'headline',
  'subhead',
  'primaryCta',
  'secondaryCta',
] as const;

heroKeys.forEach(key => {
  fields.push({
    id: `hero-${key}`,
    section: 'hero',
    labelEn: `Hero ${key}`,
    labelFa: `Hero — ${key}`,
    root: 'site',
    pathEn: `hero.en.${key}`,
    pathFa: `hero.fa.${key}`,
    type: 'bilingual',
  });
});

site.valueCards.forEach((_, index) => {
  fields.push({
    id: `hero-moto-${index}`,
    section: 'hero',
    labelEn: `Moto Card ${index + 1}`,
    labelFa: `کارت موتو ${index + 1}`,
    root: 'site',
    pathEn: `valueCards.${index}.en`,
    pathFa: `valueCards.${index}.fa`,
    type: 'bilingual',
  });
});

site.servicesPage.categories.forEach((category, catIndex) => {
  category.services.forEach((service, svcIndex) => {
    (['title', 'explanation', 'price'] as const).forEach(field => {
      fields.push({
        id: `service-${catIndex}-${svcIndex}-${field}`,
        section: 'services',
        labelEn: `${category.en.title} · ${service.en.title} · ${field}`,
        labelFa: `${category.fa.title} · ${service.fa.title} · ${field}`,
        root: 'site',
        pathEn: `servicesPage.categories.${catIndex}.services.${svcIndex}.en.${field}`,
        pathFa: `servicesPage.categories.${catIndex}.services.${svcIndex}.fa.${field}`,
        type: 'bilingual',
      });
    });
  });
});

fields.push({
  id: 'about-origin-label',
  section: 'about',
  labelEn: 'Origin — Label',
  labelFa: 'داستان — برچسب',
  root: 'pages',
  pathEn: 'about.origin.label.en',
  pathFa: 'about.origin.label.fa',
  type: 'bilingual',
});

fields.push({
  id: 'about-origin-body',
  section: 'about',
  labelEn: 'Origin — Story',
  labelFa: 'داستان — متن',
  root: 'pages',
  pathEn: 'about.origin.body.en',
  pathFa: 'about.origin.body.fa',
  type: 'bilingual',
});

pages.about.differentiators.forEach((_, index) => {
  fields.push({
    id: `about-diff-${index}-title`,
    section: 'about',
    labelEn: `Differentiator ${index + 1} — Title`,
    labelFa: `تمایز ${index + 1} — عنوان`,
    root: 'pages',
    pathEn: `about.differentiators.${index}.title.en`,
    pathFa: `about.differentiators.${index}.title.fa`,
    type: 'bilingual',
  });
  fields.push({
    id: `about-diff-${index}-body`,
    section: 'about',
    labelEn: `Differentiator ${index + 1} — Body`,
    labelFa: `تمایز ${index + 1} — متن`,
    root: 'pages',
    pathEn: `about.differentiators.${index}.body.en`,
    pathFa: `about.differentiators.${index}.body.fa`,
    type: 'bilingual',
  });
});

pages.about.principles.forEach((_, index) => {
  fields.push({
    id: `about-principle-${index}-title`,
    section: 'about',
    labelEn: `Principle ${index + 1} — Title`,
    labelFa: `اصل ${index + 1} — عنوان`,
    root: 'pages',
    pathEn: `about.principles.${index}.title.en`,
    pathFa: `about.principles.${index}.title.fa`,
    type: 'bilingual',
  });
  fields.push({
    id: `about-principle-${index}-body`,
    section: 'about',
    labelEn: `Principle ${index + 1} — Body`,
    labelFa: `اصل ${index + 1} — متن`,
    root: 'pages',
    pathEn: `about.principles.${index}.body.en`,
    pathFa: `about.principles.${index}.body.fa`,
    type: 'bilingual',
  });
});

(['label', 'headline', 'subhead'] as const).forEach(key => {
  fields.push({
    id: `headlines-services-${key}`,
    section: 'headlines',
    labelEn: `Services Section — ${key}`,
    labelFa: `بخش خدمات — ${key}`,
    root: 'site',
    pathEn: `servicesPage.header.en.${key}`,
    pathFa: `servicesPage.header.fa.${key}`,
    type: 'bilingual',
  });
});

(['title', 'subtitle'] as const).forEach(key => {
  fields.push({
    id: `headlines-about-${key}`,
    section: 'headlines',
    labelEn: `About Hero — ${key}`,
    labelFa: `Hero درباره — ${key}`,
    root: 'pages',
    pathEn: `about.hero.en.${key}`,
    pathFa: `about.hero.fa.${key}`,
    type: 'bilingual',
  });
});

(['eyebrow', 'title', 'body'] as const).forEach(key => {
  fields.push({
    id: `headlines-contact-${key}`,
    section: 'headlines',
    labelEn: `Contact Hero — ${key}`,
    labelFa: `Hero تماس — ${key}`,
    root: 'pages',
    pathEn: `contact.hero.en.${key}`,
    pathFa: `contact.hero.fa.${key}`,
    type: 'bilingual',
  });
});

(
  [
    ['instagram', 'Instagram URL'],
    ['telegram', 'Telegram'],
    ['whatsapp', 'WhatsApp'],
    ['bale', 'Bale'],
    ['email', 'Email'],
  ] as const
).forEach(([key, label]) => {
  fields.push({
    id: `contact-social-${key}`,
    section: 'contact',
    labelEn: label,
    labelFa: label,
    root: 'site',
    pathEn: `social.${key}`,
    pathFa: `social.${key}`,
    type: 'single',
  });
});

fields.push({
  id: 'contact-email-field',
  section: 'contact',
  labelEn: 'Contact Email',
  labelFa: 'ایمیل تماس',
  root: 'site',
  pathEn: 'contact.email',
  pathFa: 'contact.email',
  type: 'single',
});

export const CONTENT_FIELDS = fields;

export const CONTENT_SECTIONS: {
  id: ContentSectionId;
  emoji: string;
  labelKey: 'hero' | 'services' | 'about' | 'headlines' | 'contactSection';
}[] = [
  {id: 'hero', emoji: '🏠', labelKey: 'hero'},
  {id: 'services', emoji: '⚙️', labelKey: 'services'},
  {id: 'about', emoji: '👤', labelKey: 'about'},
  {id: 'headlines', emoji: '📋', labelKey: 'headlines'},
  {id: 'contact', emoji: '📞', labelKey: 'contactSection'},
];

export function getFieldById(id: string): ContentFieldDef | undefined {
  return CONTENT_FIELDS.find(field => field.id === id);
}
