// src/features/community/utils/categoryPreview.js
// Builds the one-line preview shown on each Explore card.
// Pure function: takes state in, returns text. No storage reads here.
// src/features/community/utils/categoryPreview.js
export const categoryPreview = (categoryId, { spaces, suggestions }) => {
  const of = (type) => spaces.filter((s) => s.type === type);

  switch (categoryId) {
    case 'groups': {
      const count = of('group').length;
      const pending = suggestions.filter((s) => s.status === 'pending').length;
      return pending ? `${count} groups · ${pending} suggested` : `${count} groups`;
    }

    case 'circles': {
      const next = of('circle').find((s) => s.joined) ?? of('circle')[0];
      return next ? `${next.dateLabel} · ${next.timeLabel}` : 'Schedule updating';
    }

    case 'identity': {
      const all = of('identity');
      const joined = all.filter((s) => s.joined).length;
      return joined > 0 ? `${all.length} spaces · ${joined} joined` : `${all.length} spaces`;
    }

    case 'resources':
      return '24/7 helplines & care kit';

    default:
      return '';
  }
};