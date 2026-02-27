export const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v.length > 11) v = v.slice(0, 11);
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/g, '($1) $2');
  if (v.length > 7) v = v.replace(/(\d)(\d{4})$/, '$1-$2');
  return v;
};

export const maskCurrency = (value: string) => {
  let v = value.replace(/\D/g, '');
  if (v === '') return '';
  v = (parseInt(v, 10) / 100).toFixed(2) + '';
  v = v.replace(".", ",");
  v = v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  return `R$ ${v}`;
};
