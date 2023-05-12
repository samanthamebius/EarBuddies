import * as React from 'react';
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';

/**
 * Control switch with IOS styling taken from https://mui.com/material-ui/react-switch/
 * @param {boolean} check - Boolean indicating if the control is currently checked or not
 * @param {Function} onChange - Method for when control switch is clicked to change styles
 * @returns {object} - IOSSwitch component
 */
export default function ControlSwitch({ checked, onChange }) {
	return (
		<IOSSwitch
			checked={checked}
			onChange={onChange}
			sx={{ m: 1 }}
		/>
	);
}

/**
 * Component that applies specfied style theme to mui Switch component
 */
const IOSSwitch = styled((props) => (
	<Switch
		focusVisibleClassName='.Mui-focusVisible'
		disableRipple
		{...props}
	/>
))(({ theme }) => ({
	width: 42,
	height: 26,
	padding: 0,
	'& .MuiSwitch-switchBase': {
		padding: 0,
		margin: 2,
		transitionDuration: '300ms',
		'&.Mui-checked': {
			transform: 'translateX(16px)',
			color: '#fff',
			'& + .MuiSwitch-track': {
				backgroundColor: theme.palette.mode === 'dark' ? '#CA3FF3' : '#D04EF7',
				opacity: 1,
				border: 0,
			},
			'&.Mui-disabled + .MuiSwitch-track': {
				opacity: 0.5,
			},
		},
		'&.Mui-focusVisible .MuiSwitch-thumb': {
			color: '#CA3FF3',
			border: '6px solid #fff',
		},
		'&.Mui-disabled .MuiSwitch-thumb': {
			color:
				theme.palette.mode === 'light'
					? theme.palette.grey[100]
					: theme.palette.grey[600],
		},
		'&.Mui-disabled + .MuiSwitch-track': {
			opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
		},
	},
	'& .MuiSwitch-thumb': {
		boxSizing: 'border-box',
		width: 22,
		height: 22,
	},
	'& .MuiSwitch-track': {
		borderRadius: 26 / 2,
		backgroundColor: theme.palette.mode === 'light' ? '#757575' : '#39393D',
		opacity: 1,
		transition: theme.transitions.create(['background-color'], {
			duration: 500,
		}),
	},
}));
