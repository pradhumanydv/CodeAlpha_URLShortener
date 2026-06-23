const button = document.getElementById("shortenBtn");

async function loadHistory() {

    const response =
        await fetch("/history/all");

    const data =
        await response.json();

    const historyBody =
        document.getElementById("historyBody");

    historyBody.innerHTML = "";

    data.forEach(item => {

        historyBody.innerHTML += `
<tr>
    <td>
        <a href="${item.longUrl}" target="_blank">
            ${item.longUrl}
        </a>
    </td>

    <td>
        <a href="/${item.shortCode}" target="_blank">
            ${item.shortCode}
        </a>
    </td>

    <td>${item.clicks}</td>
</tr>
`;

    });

}

button.addEventListener("click", async () => {

    const longUrl =
        document.getElementById("urlInput").value;

    try {

        const response = await fetch("/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                longUrl
            })

        });

        const data = await response.json();

        if (!response.ok) {

            document.getElementById("result").innerHTML =
                `<p>${data.message}</p>`;

            return;
        }

        document.getElementById("result").innerHTML =
            `<a href="${data.shortUrl}" target="_blank">
                ${data.shortUrl}
            </a>`;

        loadHistory();

    } catch (error) {

        document.getElementById("result").innerHTML =
            "Something went wrong";

    }

});

loadHistory();