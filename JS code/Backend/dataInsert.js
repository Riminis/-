const pool = require('./DBconnect');

app.use('/', UserRouter);

const insertStation = async (station) => {
  try {
    console.log('Inserting station:', station.name);
    const res = await pool.query(
      `INSERT INTO metro 
      (line_id, name, name_line, color_line, "limit", flow, latitude, longitude)  
      VALUES ($1,$2, $3, $4, $5, $6, $7, $8) 
      RETURNING *`,
      [station.line_id, [station.name] , [station.line], [station.lineColor], 16000, 7000, station.latitude, station.longitude]
    );
    console.log('Inserted:', res.rows[0]);
  } catch (error) {
    console.error('Error inserting station:', station.name);
    console.error('Error details:', error);
  }
};

async function getStations(){
  try {
    const response = await fetch('https://api.hh.ru/metro/1'); // await для fetch
    const data = await response.json(); // await для парсинга JSON
    const allStations = data.lines.flatMap(line =>
      line.stations.map(station => ({
        line_id: line.id,                   // ID станции
        name: String(station.name),               // Название станции
        line: String(line.name),                  // Линия станции
        lineColor: String(line.hex_color),        // Цвет линии
        latitude: station.lat,            // Широта станции
        longitude: station.lng
      }))
    );
    console.log(allStations[0].name);
    return allStations;
  } catch (error) {
    console.error("Ошибка при получении станций:", error);
    throw error; // Проброс ошибки для обработки в вызывающем коде
  }
};

async function vstavka_vsego_metro(){
  const allStations = await getStations();
    allStations.forEach(station => {
      insertStation(station);
    });
}