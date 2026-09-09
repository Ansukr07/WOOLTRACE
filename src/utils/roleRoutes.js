export const ROLE_HOME = {
  FARMER: '/farmer',
  SELLER: '/buyer',
  QUALITY_INSPECTOR: '/quality',
  WAREHOUSE: '/storage',
  TRANSPORT: '/logistics',
  PROCESSING_UNIT: '/processor',
  EDUCATOR: '/farmer'
};

export function getRoleHome(role) {
  return ROLE_HOME[role] || ROLE_HOME.FARMER;
}
