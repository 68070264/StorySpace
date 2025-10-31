# app.py
from flask import Flask, render_template, request, Response
from pathlib import Path
import time

# ชี้ตำแหน่ง templates/static ให้ชัด
BASE = Path(__file__).resolve().parent
app = Flask(
    __name__,
    template_folder=str(BASE / "templates"),
    static_folder=str(BASE / "static"),
)

# ----------- Web pages -----------
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/timer")
def timer_page():
    return render_template("timer.html")

@app.route("/todolist")
def todolist_page():
    return render_template("todolist.html")

@app.route("/openbotton")
def openbotton_page():
    return render_template("openbotton.html")

@app.route("/forecast")
def forecast_page():
    return render_template("forecast.html")

# ----------- SSE: stream countdown -----------
def sse_countdown(total_seconds: int):
    """ส่งเวลานับถอยหลัง HH:MM:SS ทุก 1 วินาที ผ่าน Server-Sent Events"""
    for remaining in range(total_seconds, -1, -1):
        h = remaining // 3600
        m = (remaining // 60) % 60
        s = remaining % 60
        yield f"data: {h:02d}:{m:02d}:{s:02d}\n\n"
        time.sleep(1)
    yield "event: done\ndata: Time's up!\n\n"

@app.get("/api/timer-stream")
def api_timer_stream():
    """รับ seconds จาก query แล้วสตรีมเวลาออกไป"""
    try:
        total = int(request.args.get("seconds", "0"))
    except ValueError:
        total = 0
    total = max(0, min(total, 24 * 60 * 60))

    return Response(
        sse_countdown(total),
        mimetype="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # กัน reverse proxy บางตัวบัฟเฟอร์
        },
    )

if __name__ == "__main__":
    app.run(debug=True, threaded=True)  # ถ้าชนพอร์ต เปลี่ยนเป็น port=5001
