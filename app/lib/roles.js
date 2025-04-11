export const roles = {
  ADMIN: 'admin',
  REVISOR: 'revisor',
  CAPTURISTA: 'capturista',
};

export const rolesArray = Object.values(roles);
export const rolesObject = Object.entries(roles).map(([key, value]) => {
  return { key, value };
});