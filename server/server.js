const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const dataFile = path.join(__dirname, "..", "data", "workouts.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));
// อ่านข้อมูล
function readWorkouts() {
    if (!fs.existsSync(dataFile)) {
        fs.writeFileSync(dataFile, "[]");
    }

    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

// บันทึกข้อมูล
function saveWorkouts(workouts) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(workouts, null, 2)
    );
}

// GET /api/workouts
app.get("/api/workouts", (req, res) => {
    let workouts = readWorkouts();

    // filter ด้วย ?type=
    if (req.query.type) {
        workouts = workouts.filter(
            workout =>
                workout.type.toLowerCase() ===
                req.query.type.toLowerCase()
        );
    }

    res.json(workouts);
});

// GET /api/workouts/:id
app.get("/api/workouts/:id", (req, res) => {
    const workouts = readWorkouts();

    const workout = workouts.find(
        item => item.id === Number(req.params.id)
    );

    if (!workout) {
        return res.status(404).json({
            message: "ไม่พบข้อมูลการออกกำลังกาย"
        });
    }

    res.json(workout);
});

// POST /api/workouts
app.post("/api/workouts", (req, res) => {
    const {
        name,
        type,
        duration,
        calories,
        date
    } = req.body;

    if (
        !name ||
        !type ||
        !duration ||
        !calories ||
        !date
    ) {
        return res.status(400).json({
            message: "กรุณากรอกข้อมูลให้ครบ"
        });
    }

    if (
        Number(duration) <= 0 ||
        Number(calories) < 0
    ) {
        return res.status(400).json({
            message: "ระยะเวลาและแคลอรี่ไม่ถูกต้อง"
        });
    }

    const workouts = readWorkouts();

    const newWorkout = {
        id:
            workouts.length > 0
                ? Math.max(...workouts.map(w => w.id)) + 1
                : 1,
        name,
        type,
        duration: Number(duration),
        calories: Number(calories),
        date
    };

    workouts.push(newWorkout);
    saveWorkouts(workouts);

    res.status(201).json(newWorkout);
});

// PATCH /api/workouts/:id
app.patch("/api/workouts/:id", (req, res) => {
    const workouts = readWorkouts();

    const index = workouts.findIndex(
        item => item.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "ไม่พบข้อมูลการออกกำลังกาย"
        });
    }

    workouts[index] = {
        ...workouts[index],
        ...req.body
    };

    saveWorkouts(workouts);

    res.json(workouts[index]);
});

// DELETE /api/workouts/:id
app.delete("/api/workouts/:id", (req, res) => {
    const workouts = readWorkouts();

    const index = workouts.findIndex(
        item => item.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "ไม่พบข้อมูลการออกกำลังกาย"
        });
    }

    workouts.splice(index, 1);
    saveWorkouts(workouts);

    res.status(204).send();
});

// เริ่ม Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});