/*
    CRUD API INTEGRATION
    GETS DATA - ONLOAD
    POST
    DELETE
    UPDATE
*/
export async function getData() {
  alert("apI EQUIPMENT FETCH FROM BACKEND RAN");
  try {
    const res = await fetch("http://localhost:5237/api/equipment");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log("Equipment:", data);
  } catch (err) {
    console.error("Error fetching EQUIPMENT data:", err);
  }
}


