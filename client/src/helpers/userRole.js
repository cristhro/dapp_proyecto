import Web3 from "web3";

const isAdmin = roleEnum => +roleEnum === 0;
const isCompany = roleEnum => +roleEnum === 1;
const isStudent = roleEnum => +roleEnum === 2;

const getRoleFormatted = (roleEnum) => {
  console.log('🚀 ~ getRoleFormatted ~ roleEnum:', roleEnum)
  switch (+roleEnum) {
    case 0:
      return "Administrador";
    case 1:
      return "Empresa";
    case 2:
      return "Estudiante";
    default:
      return "Unknown";
  }
}
 

export { getRoleFormatted, isAdmin, isCompany, isStudent};
