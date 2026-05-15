from flask import Flask, render_template, jsonify
import csv
import random

app = Flask(__name__)

def load_devices():

    devices = []

    with open('devices.csv', 'r') as file:

        reader = csv.DictReader(file)

        for row in reader:
            devices.append(row)

    return devices

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze')
def analyze():

    devices = load_devices()

    results = []

    total_energy = 0

    for d in devices:

        power = float(d['Power'])

        idle = float(d['IdleHours'])

        fluctuation = random.uniform(0.8, 1.3)

        energy = (power * idle * fluctuation) / 1000

        total_energy += energy

        results.append({
            'device': d['Device'],
            'department': d['Department'],
            'status': d['Status'],
            'energy': round(energy, 2)
        })

    total_cost = round(total_energy * 8, 2)

    total_carbon = round(total_energy * 0.82, 2)

    alert = 'Normal Usage'

    if total_energy > 15:
        alert = '⚠ High Phantom Power Detected!'

    return jsonify({
        'total_energy': round(total_energy, 2),
        'total_cost': total_cost,
        'total_carbon': total_carbon,
        'alert': alert,
        'details': results
    })

if __name__ == '__main__':
    app.run(debug=True)