


export const uploadNotification = async (payload) => {
    const res = await fetch('http://localhost:3000/notification/post', {
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
