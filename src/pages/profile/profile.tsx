	import {Map} from '../../components/Map';
	import { Coordinates } from '../ConsolePage';

	interface ProfileProps {
	marker: Coordinates | null,
	coords: Coordinates | null,
	memoryKv: any;
	}

	const ProfilePage: React.FC<ProfileProps> = ({ marker, coords, memoryKv }) => {
	return (
		<div className="content-right">
		<div className="content-block map">
		<div className="content-block-title">Prosqdqsdqsdqsdqsfile</div>
		<div className="content-block-title bottom">
			{marker?.location || 'not yet retrieved'}
			{!!marker?.temperature && (
			<>
				<br />
				🌡️ {marker.temperature.value} {marker.temperature.units}
			</>
			)}
			{!!marker?.wind_speed && (
			<>
				{' '}
				🍃 {marker.wind_speed.value} {marker.wind_speed.units}
			</>
			)}
		</div>
		<div className="content-block-body full">
			{coords && (
			<Map
				center={[coords.lat, coords.lng]}
				location={coords.location}
			/>
			)}
		</div>
		</div>
		<div className="content-block kv">
		<div className="content-block-title">track_learning()</div>
		<div className="content-block-body content-kv">
			{JSON.stringify(memoryKv, null, 2)}
		</div>
		</div>
	</div>
	);
	}

	export default ProfilePage;
