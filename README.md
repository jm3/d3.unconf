### d3.Unconference 2014 noodleboots jam sesh, toaster-oven exposion remix

## Setup:

```bash
git clone proj
cd proj
npm install
grunt
```

to simplify maps:
```
ogr2ogr -f GeoJSON -simplify 0.2 -where "SU_A3 <> 'ATA'" countries.json ne_10m_admin_0_countries_lakes.shp

topojson --id-property SU_A3 -p name=NAME -p name -o countries.topo.json countries.json
```

To simplify a complex map data file to make loading + rendering faster:

- http://www.mapshaper.org/

