// ========================================
// ตัวแปรหลัก
// ========================================

let allWorkouts = [];

let currentDate = new Date();


// ========================================
// Element
// ========================================

const workoutForm =
    document.getElementById(
        "workoutForm"
    );

const workoutList =
    document.getElementById(
        "workoutList"
    );

const filterType =
    document.getElementById(
        "filterType"
    );

const calendar =
    document.getElementById(
        "calendar"
    );

const calendarTitle =
    document.getElementById(
        "calendarTitle"
    );

const prevMonth =
    document.getElementById(
        "prevMonth"
    );

const nextMonth =
    document.getElementById(
        "nextMonth"
    );


// ========================================
// ชื่อเดือนภาษาไทย
// ========================================

const thaiMonths = [

    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม"

];


// ========================================
// GET ข้อมูลทั้งหมด
// ========================================

async function loadWorkouts() {

    try {

        const response =
            await fetch(
                "/api/workouts"
            );


        if (!response.ok) {

            throw new Error(
                "ไม่สามารถโหลดข้อมูลได้"
            );

        }


        allWorkouts =
            await response.json();


        // แสดงรายการ
        renderWorkoutList();


        // แสดงปฏิทิน
        renderCalendar();


    } catch (error) {

        console.error(error);

        workoutList.innerHTML = `

            <div class="empty-message">

                ไม่สามารถโหลดข้อมูลได้

            </div>

        `;

    }

}


// ========================================
// แสดงรายการออกกำลังกาย
// ========================================

function renderWorkoutList() {

    workoutList.innerHTML = "";


    let workouts =
        [...allWorkouts];


    // กรองประเภท
    const selectedType =
        filterType.value;


    if (selectedType) {

        workouts =
            workouts.filter(
                workout =>
                    workout.type
                        .toLowerCase() ===
                    selectedType.toLowerCase()
            );

    }


    // ไม่มีข้อมูล
    if (workouts.length === 0) {

        workoutList.innerHTML = `

            <div class="empty-message">

                📝 ยังไม่มีรายการออกกำลังกาย

            </div>

        `;

        return;

    }


    // แสดงข้อมูล
    workouts.forEach(
        workout => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "workout-card";


            card.innerHTML = `

                <h3>
                    🏃 ${escapeHTML(
                        workout.name
                    )}
                </h3>

                <div class="workout-info">

                    <p>
                        <strong>
                            ประเภท:
                        </strong>

                        ${escapeHTML(
                            workout.type
                        )}
                    </p>


                    <p>
                        <strong>
                            ระยะเวลา:
                        </strong>

                        ${workout.duration}
                        นาที
                    </p>


                    <p>
                        <strong>
                            แคลอรี:
                        </strong>

                        ${workout.calories}
                        kcal
                    </p>


                    <p>
                        <strong>
                            วันที่:
                        </strong>

                        ${workout.date}
                    </p>

                </div>


                <div class="card-buttons">

                    <button
                        class="edit-btn"
                        onclick="editWorkout(
                            ${workout.id}
                        )"
                    >
                        ✏️ แก้ไข
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteWorkout(
                            ${workout.id}
                        )"
                    >
                        🗑️ ลบ
                    </button>

                </div>

            `;


            workoutList.appendChild(
                card
            );

        }
    );

}


// ========================================
// POST เพิ่มข้อมูล
// ========================================

workoutForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();


        const type =
            document.getElementById(
                "type"
            ).value;


        const duration =
            document.getElementById(
                "duration"
            ).value;


        const calories =
            document.getElementById(
                "calories"
            ).value;


        const date =
            document.getElementById(
                "date"
            ).value;


        const workout = {

            name,
            type,
            duration,
            calories,
            date

        };


        try {

            const response =
                await fetch(
                    "/api/workouts",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                workout
                            )

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                alert(
                    result.message
                );

                return;

            }


            alert(
                "✅ บันทึกการออกกำลังกายสำเร็จ"
            );


            workoutForm.reset();


            // โหลดข้อมูลใหม่
            await loadWorkouts();


        } catch (error) {

            console.error(error);

            alert(
                "เกิดข้อผิดพลาดในการบันทึกข้อมูล"
            );

        }

    }
);


// ========================================
// PATCH แก้ไขข้อมูล
// ========================================

async function editWorkout(id) {

    const workout =
        allWorkouts.find(
            item =>
                item.id === id
        );


    if (!workout) {

        alert(
            "ไม่พบข้อมูล"
        );

        return;

    }


    const name =
        prompt(
            "ชื่อการออกกำลังกาย:",
            workout.name
        );


    if (name === null) {

        return;

    }


    const type =
        prompt(
            "ประเภท (Cardio / Strength / Flexibility):",
            workout.type
        );


    if (type === null) {

        return;

    }


    const duration =
        prompt(
            "ระยะเวลา (นาที):",
            workout.duration
        );


    if (duration === null) {

        return;

    }


    const calories =
        prompt(
            "แคลอรี (kcal):",
            workout.calories
        );


    if (calories === null) {

        return;

    }


    const date =
        prompt(
            "วันที่ (YYYY-MM-DD):",
            workout.date
        );


    if (date === null) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/workouts/${id}`,
                {

                    method: "PATCH",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            name:
                                name.trim(),

                            type:
                                type.trim(),

                            duration:
                                Number(
                                    duration
                                ),

                            calories:
                                Number(
                                    calories
                                ),

                            date

                        })

                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message
            );

            return;

        }


        alert(
            "✅ แก้ไขข้อมูลสำเร็จ"
        );


        await loadWorkouts();


    } catch (error) {

        console.error(error);

        alert(
            "เกิดข้อผิดพลาดในการแก้ไขข้อมูล"
        );

    }

}


// ========================================
// DELETE ลบข้อมูล
// ========================================

async function deleteWorkout(id) {

    const confirmDelete =
        confirm(
            "คุณต้องการลบรายการนี้หรือไม่?"
        );


    if (!confirmDelete) {

        return;

    }


    try {

        const response =
            await fetch(
                `/api/workouts/${id}`,
                {

                    method: "DELETE"

                }
            );


        if (
            response.status === 204
        ) {

            alert(
                "🗑️ ลบข้อมูลสำเร็จ"
            );


            await loadWorkouts();

            return;

        }


        const result =
            await response.json();


        alert(
            result.message
        );


    } catch (error) {

        console.error(error);

        alert(
            "เกิดข้อผิดพลาดในการลบข้อมูล"
        );

    }

}


// ========================================
// FILTER
// ========================================

filterType.addEventListener(
    "change",
    function () {

        renderWorkoutList();

    }
);


// ========================================
// CALENDAR
// ========================================

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    // ชื่อเดือน
    calendarTitle.textContent =
        `${thaiMonths[month]} ${
            year + 543
        }`;


    // วันแรกของเดือน
    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    // จำนวนวัน
    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // ช่องว่างก่อนวันที่ 1
    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const emptyDay =
            document.createElement(
                "div"
            );


        emptyDay.className =
            "calendar-day empty";


        calendar.appendChild(
            emptyDay
        );

    }


    // สร้างแต่ละวัน
    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayElement =
            document.createElement(
                "div"
            );


        dayElement.className =
            "calendar-day";


        // ตรวจสอบวันนี้
        const today =
            new Date();


        if (

            day ===
                today.getDate()

            &&

            month ===
                today.getMonth()

            &&

            year ===
                today.getFullYear()

        ) {

            dayElement.classList.add(
                "today"
            );

        }


        // เลขวันที่
        const dayNumber =
            document.createElement(
                "div"
            );


        dayNumber.className =
            "day-number";


        dayNumber.textContent =
            day;


        dayElement.appendChild(
            dayNumber
        );


        // วันที่รูปแบบ YYYY-MM-DD
        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(
                2,
                "0"
            )}-${String(
                day
            ).padStart(
                2,
                "0"
            )}`;


        // หารายการของวันนั้น
        const dayWorkouts =
            allWorkouts.filter(
                workout =>
                    workout.date ===
                    dateString
            );


        // แสดงรายการ
        dayWorkouts.forEach(
            workout => {

                const event =
                    document.createElement(
                        "div"
                    );


                event.className =
                    "workout-event";


                event.innerHTML = `

                    <strong>
                        🏃 ${escapeHTML(
                            workout.name
                        )}
                    </strong>

                    ${workout.duration}
                    นาที

                `;


                // คลิกดูรายละเอียด
                event.addEventListener(
                    "click",
                    function () {

                        alert(

                            `🏋️ รายละเอียดการออกกำลังกาย\n\n` +

                            `ชื่อ: ${workout.name}\n` +

                            `ประเภท: ${workout.type}\n` +

                            `ระยะเวลา: ${workout.duration} นาที\n` +

                            `แคลอรี: ${workout.calories} kcal\n` +

                            `วันที่: ${workout.date}`

                        );

                    }
                );


                dayElement.appendChild(
                    event
                );

            }
        );


        calendar.appendChild(
            dayElement
        );

    }

}


// ========================================
// เดือนก่อนหน้า
// ========================================

prevMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );


        renderCalendar();

    }
);


// ========================================
// เดือนถัดไป
// ========================================

nextMonth.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );


        renderCalendar();

    }
);


// ========================================
// ป้องกัน HTML แปลก ๆ
// ========================================

function escapeHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// ========================================
// เริ่มต้นโหลดข้อมูล
// ========================================

loadWorkouts();