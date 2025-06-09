

const backendDomain = "http://localhost:8080"

const SummaryApi ={
    login:{
        url:`${backendDomain}/login`,
        method:"post",
    },
    signup:{
        url:`${backendDomain}/signup`,
        method:"post",
    },
    logout:{
        url:`${backendDomain}/logout`,
        method:"post",
    },
    userDetails:{
        url:`${backendDomain}/userdetails`,
        method:"get",
    },
}
export default SummaryApi