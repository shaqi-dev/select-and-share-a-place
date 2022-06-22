import axios from "axios";

const form = document.querySelector("form")!;
const mapEl = document.getElementById("map")!;
const addressInput = document.getElementById("address")! as HTMLInputElement;

const GOOGLE_API_KEY = "AIzaSyBoHJLkL6YDzYCA8E4kIu2WMRBhL5tcj9M";

type GoogleGeocodingResponse = {
	results: { geometry: { location: { lat: number; lng: number } } }[];
	status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
	event.preventDefault();
	const enteredAddress = addressInput.value;

	axios
		.get<GoogleGeocodingResponse>(
			`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
				enteredAddress
			)}&key=${GOOGLE_API_KEY}`
		)
		.then((response) => {
			if (response.data.status !== "OK") {
				throw new Error("Could not fetch location");
			}
			const coordinates = response.data.results[0].geometry.location;
			const map = new google.maps.Map(mapEl, {
				center: coordinates,
				zoom: 16,
			});

			new google.maps.Marker({
				position: coordinates,
				map: map,
			});
		})
		.catch((error) => {
			alert(error.message);
			console.log(error);
		});
}

form.addEventListener("submit", searchAddressHandler);
