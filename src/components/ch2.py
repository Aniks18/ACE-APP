import pandas as pd
import geopandas as gpd
import json
import webbrowser
import os

def load_geojson_data():
    url = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson"
    india_states = gpd.read_file(url)
    india_states['state'] = india_states['NAME_1'].str.title()
    return india_states

def create_sample_json():
    if not os.path.exists('india_disease_data.json'):
        sample_data = {
            "Malaria": {
                "Maharashtra": {"cases": 500, "severity": "high"},
                "Gujarat": {"cases": 300, "severity": "medium"},
                "Karnataka": {"cases": 200, "severity": "low"}
            },
            "Dengue": {
                "Kerala": {"cases": 350, "severity": "medium"},
                "West Bengal": {"cases": 250, "severity": "low"},
                "Tamil Nadu": {"cases": 400, "severity": "high"}
            },
            "COVID-19": {
                "Delhi": {"cases": 1000, "severity": "very high"},
                "Maharashtra": {"cases": 800, "severity": "high"},
                "Karnataka": {"cases": 600, "severity": "medium"}
            }
        }
        with open('india_disease_data.json', 'w') as f:
            json.dump(sample_data, f, indent=2)
        print("Created sample india_disease_data.json file.")

def load_disease_data():
    with open('india_disease_data.json', 'r') as f:
        return json.load(f)

def generate_map(selected_disease, disease_data, india_states):
    df = pd.DataFrame([(state, data['cases'], data['severity']) 
                       for state, data in disease_data[selected_disease].items()],
                      columns=['state', 'cases', 'severity'])

    india_states_merged = india_states.merge(df, on='state', how='left')
    geojson_data = json.loads(india_states_merged.to_json())

    html_content = '''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>India {disease} Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
            #map {{ height: 600px; width: 100%; }}
            .info {{ padding: 6px 8px; font: 14px/16px Arial, Helvetica, sans-serif; background: white; background: rgba(255,255,255,0.8); box-shadow: 0 0 15px rgba(0,0,0,0.2); border-radius: 5px; }}
            .info h4 {{ margin: 0 0 5px; color: #777; }}
            .legend {{ text-align: left; line-height: 18px; color: #555; }}
            .legend i {{ width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7; }}
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            var map = L.map('map').setView([20.5937, 78.9629], 5);

            L.tileLayer('https://{{s}}.tile.openstreetmap.org/{{z}}/{{x}}/{{y}}.png', {{
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }}).addTo(map);

            var geojsonData = {geojson_data};

            function getColor(severity) {{
                return severity === 'very high' ? '#800026' :
                       severity === 'high' ? '#BD0026' :
                       severity === 'medium' ? '#FC4E2A' :
                       severity === 'low' ? '#FED976' :
                                  '#FFEDA0';
            }}

            function style(feature) {{
                return {{
                    fillColor: getColor(feature.properties.severity),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    dashArray: '3',
                    fillOpacity: 0.7
                }};
            }}

            function highlightFeature(e) {{
                var layer = e.target;

                layer.setStyle({{
                    weight: 5,
                    color: '#666',
                    dashArray: '',
                    fillOpacity: 0.7
                }});

                layer.bringToFront();
                info.update(layer.feature.properties);
            }}

            function resetHighlight(e) {{
                geojson.resetStyle(e.target);
                info.update();
            }}

            function onEachFeature(feature, layer) {{
                layer.on({{
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                }});
            }}

            var geojson = L.geoJson(geojsonData, {{
                style: style,
                onEachFeature: onEachFeature
            }}).addTo(map);

            var info = L.control();

            info.onAdd = function (map) {{
                this._div = L.DomUtil.create('div', 'info');
                this.update();
                return this._div;
            }};

            info.update = function (props) {{
                this._div.innerHTML = '<h4>{disease} Cases in India</h4>' +  (props ?
                    '<b>' + props.state + '</b><br />' + 
                    (props.cases ? props.cases + ' cases<br />' : 'No data<br />') +
                    (props.severity ? 'Severity: ' + props.severity : '')
                    : 'Hover over a state');
            }};

            info.addTo(map);

            var legend = L.control({{position: 'bottomright'}});

            legend.onAdd = function (map) {{
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = ['low', 'medium', 'high', 'very high'],
                    labels = [];

                for (var i = 0; i < grades.length; i++) {{
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '<br>' : '');
                }}

                return div;
            }};

            legend.addTo(map);
        </script>
    </body>
    </html>
    '''.format(disease=selected_disease, geojson_data=json.dumps(geojson_data))

    with open('india_disease_map.html', 'w') as f:
        f.write(html_content)

    webbrowser.open('india_disease_map.html')
    print(f"Map for {selected_disease} has been generated and opened in your default browser.")

def main():
    india_states = load_geojson_data()
    create_sample_json()
    disease_data = load_disease_data()

    while True:
        print("\nAvailable diseases:", ", ".join(disease_data.keys()))
        selected_disease = input("Enter the name of the disease (or 'quit' to exit): ").strip().title()

        if selected_disease.lower() == 'quit':
            print("Thank you for using the India Disease Map Generator. Goodbye!")
            break

        disease_key = next((k for k in disease_data.keys() if k.lower() == selected_disease.lower()), None)

        if disease_key is None:
            print(f"No data available for {selected_disease}")
            continue

        generate_map(disease_key, disease_data, india_states)

if __name__ == "__main__":
    main()