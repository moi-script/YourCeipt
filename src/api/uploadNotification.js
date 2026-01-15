const BASE_API_URL  = import.meta.env.VITE_URL_BACKEND || "http://localhost:5173"



export const uploadNotification = async (payload) => {
    const res = await fetch(BASE_API_URL + '/notification/post', {
        method : "POST",
        headers : {
            "Content-type" : "application/json"
        },
        body : JSON.stringify({
            userId : payload.userId,
            title : payload.title,
            message : payload.message,
            type : payload.type
        })
    })

    if(!res.ok) throw Error('Unable to upload notification');

    // console.alert("notification uploaded sucessfully");
}
