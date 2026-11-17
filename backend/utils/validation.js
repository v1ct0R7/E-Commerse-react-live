// id-te ne MySQL jane numra te plote pozitive (1, 2, 3 ...)
export const isValidId = (id) => /^[1-9]\d*$/.test(String(id ?? ""));
