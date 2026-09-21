const video = document.getElementById("camera");
const status = document.getElementById("status");
const locationText = document.getElementById("location");
const alertCard = document.getElementById("alertCard");
const alertMessage = document.getElementById("alertMessage");
const alertLocation = document.getElementById("alertLocation");
const alertStatus = document.getElementById("alertStatus");
const alertTime = document.getElementById("alertTime");

function startEmergency() {
navigator.geolocation.getCurrentPosition(
    function(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        locationText.textContent =
            "Location: " + latitude.toFixed(5) +
            ", " + longitude.toFixed(5);
    },
    function() {
        locationText.textContent = "Location: Permission denied";
    }
);
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();

            status.textContent = "Camera on — starting hand detection...";
            startHandDetection();
        })
        .catch(function(error) {
            status.textContent = "Camera permission denied.";
        });
}

function reportUnsafe() {

    const reportBox = document.createElement("div");

    reportBox.innerHTML = `
        <div style="
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.75);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            padding: 20px;
        ">

            <div style="
                width: 100%;
                max-width: 460px;
                background: #0c1b2d;
                border: 1px solid rgba(245,193,78,0.4);
                border-radius: 22px;
                padding: 28px;
                color: white;
                box-shadow: 0 25px 70px rgba(0,0,0,0.6);
                text-align: center;
            ">

                <h2 style="
                    margin-top: 0;
                    color: #f5c451;
                ">
                    Report Unsafe Situation
                </h2>

                <p style="
                    color: #9fb0c3;
                    margin-bottom: 22px;
                ">
                    Select the type of situation.
                </p>

                <button id="harassmentReport" style="
                    width: 100%;
                    padding: 14px;
                    margin: 6px 0;
                    border-radius: 11px;
                    border: 1px solid #344b62;
                    background: #14283d;
                    color: white;
                    cursor: pointer;
                ">
                    Harassment / Threat
                </button>

                <button id="accidentReport" style="
                    width: 100%;
                    padding: 14px;
                    margin: 6px 0;
                    border-radius: 11px;
                    border: 1px solid #344b62;
                    background: #14283d;
                    color: white;
                    cursor: pointer;
                ">
                    Accident / Medical Help
                </button>

                <button id="unsafeReport" style="
                    width: 100%;
                    padding: 14px;
                    margin: 6px 0;
                    border-radius: 11px;
                    border: 1px solid #344b62;
                    background: #14283d;
                    color: white;
                    cursor: pointer;
                ">
                    Unsafe Environment
                </button>

                <button id="closeReport" style="
                    width: 100%;
                    padding: 12px;
                    margin-top: 15px;
                    border-radius: 10px;
                    border: 1px solid #445;
                    background: transparent;
                    color: #9aa8b7;
                    cursor: pointer;
                ">
                    CANCEL
                </button>

            </div>
        </div>
    `;

    document.body.appendChild(reportBox);


    function submitReport(type) {

        const locationInfo =
            document.getElementById("location").textContent;

        reportBox.innerHTML = `
            <div style="
                position: fixed;
                inset: 0;
                background: rgba(0,0,0,0.75);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                padding: 20px;
            ">

                <div style="
                    width: 100%;
                    max-width: 460px;
                    background: #0c1b2d;
                    border: 1px solid #67c98b;
                    border-radius: 22px;
                    padding: 30px;
                    color: white;
                    text-align: center;
                    box-shadow: 0 25px 70px rgba(0,0,0,0.6);
                ">

                    <div style="
                        font-size: 42px;
                        color: #76d49a;
                    ">
                        ✓
                    </div>

                    <h2 style="
                        color: #76d49a;
                    ">
                        Report Prepared
                    </h2>

                    <p style="color:#ffffff;">
                        ${type}
                    </p>

                    <p style="
                        color:#91a5b8;
                        font-size:13px;
                    ">
                        ${locationInfo}
                    </p>

                    <p style="
                        color:#8196aa;
                        font-size:13px;
                    ">
                        Prototype report recorded successfully.
                    </p>

                    <button id="finishReport" style="
                        width: 100%;
                        padding: 14px;
                        border: none;
                        border-radius: 11px;
                        background: #f5bd4d;
                        color: #07111d;
                        font-weight: bold;
                        cursor: pointer;
                    ">
                        DONE
                    </button>

                </div>
            </div>
        `;

        document
            .getElementById("finishReport")
            .addEventListener("click", function() {
                reportBox.remove();
            });
    }


    document
        .getElementById("harassmentReport")
        .addEventListener("click", function() {
            submitReport("Harassment / Threat");
        });


    document
        .getElementById("accidentReport")
        .addEventListener("click", function() {
            submitReport("Accident / Medical Help");
        });


    document
        .getElementById("unsafeReport")
        .addEventListener("click", function() {
            submitReport("Unsafe Environment");
        });


    document
        .getElementById("closeReport")
        .addEventListener("click", function() {
            reportBox.remove();
        });
}

function startHandDetection() {

    if (typeof Hands === "undefined") {
        status.textContent = "Hand detection library not loaded.";
        return;
    }

    status.textContent = "Hand detection ready — show your hand!";

    const hands = new Hands({
        locateFile: function(file) {
            return "https://cdn.jsdelivr.net/npm/@mediapipe/hands/" + file;
        }
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(function(results) {

       if (results.multiHandLandmarks &&
    results.multiHandLandmarks.length > 0) {

    const hand = results.multiHandLandmarks[0];

    const indexOpen = hand[8].y < hand[6].y;
    const middleOpen = hand[12].y < hand[10].y;
    const ringOpen = hand[16].y < hand[14].y;
    const pinkyOpen = hand[20].y < hand[18].y;

  const thumbUp = hand[4].y < hand[3].y &&
                hand[4].y < hand[6].y;

if (indexOpen && middleOpen && ringOpen && pinkyOpen) {
    status.textContent = "✋ I NEED HELP";

    alertCard.style.display = "block";
    alertMessage.textContent = "I NEED HELP";
    alertLocation.textContent = locationText.textContent;

} else if (!indexOpen && !middleOpen && !ringOpen && !pinkyOpen && !thumbUp) {
    status.textContent = "✊ IMMEDIATE DANGER";

    alertCard.style.display = "block";
    alertMessage.textContent = "IMMEDIATE DANGER";
    alertLocation.textContent = locationText.textContent;

} else if (thumbUp && !indexOpen && !middleOpen && !ringOpen && !pinkyOpen) {
    status.textContent = "👍 I AM SAFE";

    alertCard.style.display = "none";

} else {
    status.textContent = "Hand detected";
}
 }
    });

    detectHands(hands);
}

async function detectHands(hands) {

    if (video.readyState >= 2) {
        await hands.send({ image: video });
    }

    requestAnimationFrame(function() {
        detectHands(hands);
    });
}
document.getElementById("sendAlert").addEventListener("click", function() {

    this.textContent = "✓ ALERT SENT TO TRUSTED CONTACT";

    alertStatus.textContent = "Alert Status: SENT";

    const now = new Date();

    alertTime.textContent =
        "Time: " + now.toLocaleTimeString();

    this.disabled = true;
});