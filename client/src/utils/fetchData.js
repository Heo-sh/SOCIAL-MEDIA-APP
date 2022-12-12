// server에 data를 요청하는 함수
export default function fetchData(url) {
    const promise = fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` }
    })
    .then(res => {
        if (!res.ok) {
            throw res;
        }
        return res.json()
    })

    return promise;
}