import * as Handlebars from 'handlebars';

export function registerHandlebarsHelpers(): void {
  Handlebars.registerHelper('formatDate', (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  Handlebars.registerHelper('percentage', (score: number, total: number) => {
    return Math.round((score / total) * 100);
  });

  Handlebars.registerHelper('capitalize', (str: string) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  });

  Handlebars.registerHelper('scoreColor', (percentage: number) => {
    if (percentage >= 80) return '#10b981'; // green
    if (percentage >= 60) return '#f59e0b'; // amber
    return '#ef4444'; // red
  });

  Handlebars.registerHelper('formatNumber', (num: number) => {
    return num.toLocaleString('en-US');
  });

  Handlebars.registerHelper(
    'ifGte',
    function (
      this: unknown,
      a: number,
      b: number,
      options: Handlebars.HelperOptions,
    ) {
      if (a >= b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
  );
}
