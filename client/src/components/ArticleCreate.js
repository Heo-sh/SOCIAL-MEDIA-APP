import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ArticleCreate() {

    const navigate = useNavigate();
    const [files, setFiles] = useState({});
    const [text, setText] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);

        fetch(`${process.env.REACT_APP_SERVER}/articles`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.json()
        })
        .then(data => {
            // feed page로 이동한다.
            navigate("/", { replace: true });
        })
        .catch(error => {
            alert("Something's broken");
        })
    }

    console.log(files);

    const fileList = Object.keys(files).map(key => (
        <li key={key}>{files[key].name}</li>
    ))

    return (
        <form onSubmit={handleSubmit} className="px-2">
            <div className="mb-2">
                <label className="block">Photos</label>
                <input
                    type="file"
                    name="images"
                    onChange={(e) => setFiles(e.target.files)}
                    // 동시선택을 가능케 한다
                    multiple={true}
                    // image type만 받겠다
                    // *: 확장자(jpg,gif)가 어떠한 것이든 다 받겠다라는 표시
                    accept="image/*"
                />
                <ul className="bg-gray-100">
                    {fileList}
                </ul>
            </div>

            <div className="mb-2">
                <label htmlFor="">Description</label>
                <textarea 
                    rows="3"
                    name="description"
                    className="block w-full px-2 py-1 border"
                    defaultValue={text}
                    onChange={(e) => setText(e.target.value)}
                />
            </div>

            <div>
                <button
                    type="submit"
                    className="px-2 border border-black disabled:opacity-[0.2]"
                    disabled={fileList.length<1}
                >
                Submit
                </button>
            </div>
        </form>
    )
}