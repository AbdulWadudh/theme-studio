import type React from "react";

export const CircleXIcon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={24}
		height={24}
		fill="none"
		color={color}
		{...props}
	>
		<circle
			cx="12"
			cy="12"
			r="10"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M9 9L15 15M15 9L9 15"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const SwatchIcon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={24}
		height={24}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M16.5551 4C17.0179 4.42885 17.5421 4.96506 18.1713 5.60862C20.0571 7.53758 21 8.50206 21 9.70056C21 10.8991 20.0571 11.8635 18.1713 13.7925L11.7706 20.3396C11.5289 20.5868 11.2709 20.8069 11 21"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<path
			d="M2 16.6153C2 19.5892 4.48731 22 7.55556 22H16.4444C19.0634 22 20.3728 22 21.1864 21.2114C22 20.4229 22 19.1537 22 16.6153C22 16.0078 22 15.4729 21.9888 15"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<path
			d="M2 7.55556C2 4.93664 2 3.62718 2.80546 2.81359C3.61091 2 4.90728 2 7.5 2C10.0927 2 11.3891 2 12.1945 2.81359C13 3.62718 13 4.93664 13 7.55556V16.4444C13 19.5127 10.5376 22 7.5 22C4.46243 22 2 19.5127 2 16.4444V7.55556Z"
			stroke={stroke}
			strokeWidth="1.5"
		/>
		<path
			d="M7.5 17.5H7.50898"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M2 8H13M2 13H13"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Setup01Icon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={24}
		height={24}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M17.458 9.08015L17.1669 8.56619C16.9468 8.17749 16.8367 7.98314 16.6494 7.90564C16.4622 7.82814 16.2503 7.8893 15.8267 8.0116L15.1071 8.21782C14.8366 8.28127 14.5529 8.24528 14.3059 8.11619L14.1072 7.99956C13.8955 7.86157 13.7326 7.65811 13.6424 7.41896L13.4455 6.82053C13.316 6.42452 13.2512 6.22651 13.0971 6.11325C12.943 6 12.7382 6 12.3287 6H11.6713C11.2618 6 11.057 6 10.9029 6.11325C10.7488 6.22651 10.684 6.42452 10.5545 6.82053L10.3576 7.41896C10.2674 7.65811 10.1045 7.86157 9.89276 7.99956L9.69409 8.11619C9.44713 8.24528 9.16338 8.28127 8.89292 8.21782L8.17329 8.0116C7.74966 7.8893 7.53785 7.82814 7.35056 7.90564C7.16327 7.98314 7.0532 8.17749 6.83305 8.56619L6.54196 9.08015C6.3356 9.4445 6.23243 9.62667 6.25245 9.82061C6.27248 10.0145 6.4106 10.1708 6.68686 10.4834L7.29491 11.175C7.44352 11.3664 7.54903 11.7 7.54903 11.9999C7.54903 12.3 7.44355 12.6335 7.29492 12.8249L6.68686 13.5166L6.68686 13.5166C6.4106 13.8291 6.27248 13.9854 6.25245 14.1793C6.23243 14.3733 6.33561 14.5555 6.54196 14.9198L6.83304 15.4337C7.05319 15.8224 7.16327 16.0168 7.35056 16.0943C7.53785 16.1718 7.74967 16.1106 8.17331 15.9883L8.89289 15.7821C9.1634 15.7186 9.44721 15.7547 9.69419 15.8838L9.89284 16.0004C10.1046 16.1384 10.2674 16.3419 10.3576 16.581L10.5545 17.1795C10.684 17.5755 10.7488 17.7735 10.9029 17.8867C11.057 18 11.2618 18 11.6713 18H12.3287C12.7382 18 12.943 18 13.0971 17.8867C13.2512 17.7735 13.316 17.5755 13.4455 17.1795L13.6424 16.581C13.7326 16.3419 13.8954 16.1384 14.1072 16.0004L14.3058 15.8838C14.5528 15.7547 14.8366 15.7186 15.1071 15.7821L15.8267 15.9883C16.2503 16.1106 16.4621 16.1718 16.6494 16.0943C16.8367 16.0168 16.9468 15.8224 17.167 15.4338L17.167 15.4337L17.458 14.9198C17.6644 14.5555 17.7676 14.3733 17.7475 14.1793C17.7275 13.9854 17.5894 13.8291 17.3131 13.5166L16.7051 12.8249C16.5564 12.6335 16.451 12.3 16.451 11.9999C16.451 11.7 16.5565 11.3664 16.7051 11.175L17.3131 10.4834C17.5894 10.1708 17.7275 10.0145 17.7475 9.82061C17.7676 9.62667 17.6644 9.4445 17.458 9.08015Z"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<circle cx="12" cy="12" r="1.75" stroke={stroke} strokeWidth="1.5" />
		<path
			d="M19 2V4.85857C17.1962 3.09032 14.7255 2 12 2C6.47715 2 2 6.47715 2 12C2 13.4222 2.29689 14.7751 2.83209 16M5 22V19.1414C6.80375 20.9097 9.27455 22 12 22C17.5228 22 22 17.5228 22 12C22 10.5778 21.7031 9.22492 21.1679 8"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Sun02Icon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={18}
		height={18}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
			stroke={stroke}
			strokeWidth="1.5"
		/>
		<path
			d="M12 2C11.6227 2.33333 11.0945 3.2 12 4M12 20C12.3773 20.3333 12.9055 21.2 12 22M19.5 4.50271C18.9685 4.46982 17.9253 4.72293 18.0042 5.99847M5.49576 17.5C5.52865 18.0315 5.27555 19.0747 4 18.9958M5.00271 4.5C4.96979 5.03202 5.22315 6.0763 6.5 5.99729M18 17.5026C18.5315 17.4715 19.5747 17.7108 19.4958 18.9168M22 12C21.6667 11.6227 20.8 11.0945 20 12M4 11.5C3.66667 11.8773 2.8 12.4055 2 11.5"
			stroke={stroke}
			strokeLinecap="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const Moon02Icon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={18}
		height={18}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M21.5 14.0784C20.3003 14.7189 18.9301 15.0821 17.4751 15.0821C12.7491 15.0821 8.91792 11.2509 8.91792 6.52485C8.91792 5.06986 9.28105 3.69968 9.92163 2.5C5.66765 3.49698 2.5 7.31513 2.5 11.8731C2.5 17.1899 6.8101 21.5 12.1269 21.5C16.6849 21.5 20.503 18.3324 21.5 14.0784Z"
			stroke={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const ComputerIcon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={18}
		height={18}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M14 21H16M14 21C13.1716 21 12.5 20.3284 12.5 19.5V17L12 17M14 21H10M10 21H8M10 21C10.8284 21 11.5 20.3284 11.5 19.5V17L12 17M12 17V21"
			stroke={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
		<path
			d="M16 3H8C5.17157 3 3.75736 3 2.87868 3.87868C2 4.75736 2 6.17157 2 9V11C2 13.8284 2 15.2426 2.87868 16.1213C3.75736 17 5.17157 17 8 17H16C18.8284 17 20.2426 17 21.1213 16.1213C22 15.2426 22 13.8284 22 11V9C22 6.17157 22 4.75736 21.1213 3.87868C20.2426 3 18.8284 3 16 3Z"
			stroke={stroke}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
		/>
	</svg>
);

export const TextFontIcon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={18}
		height={18}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M14 19L11.1069 10.7479C9.76348 6.91597 9.09177 5 8 5C6.90823 5 6.23652 6.91597 4.89309 10.7479L2 19M4.5 12H11.5"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M21.9692 13.9392V18.4392M21.9692 13.9392C22.0164 13.1161 22.0182 12.4891 21.9194 11.9773C21.6864 10.7709 20.4258 10.0439 19.206 9.89599C18.0385 9.75447 17.1015 10.055 16.1535 11.4363M21.9692 13.9392L19.1256 13.9392C18.6887 13.9392 18.2481 13.9603 17.8272 14.0773C15.2545 14.7925 15.4431 18.4003 18.0233 18.845C18.3099 18.8944 18.6025 18.9156 18.8927 18.9026C19.5703 18.8724 20.1955 18.545 20.7321 18.1301C21.3605 17.644 21.9692 16.9655 21.9692 15.9392V13.9392Z"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Layers01Icon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={18}
		height={18}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M8.64298 3.14559L6.93816 3.93362C4.31272 5.14719 3 5.75397 3 6.75C3 7.74603 4.31272 8.35281 6.93817 9.56638L8.64298 10.3544C10.2952 11.1181 11.1214 11.5 12 11.5C12.8786 11.5 13.7048 11.1181 15.357 10.3544L17.0618 9.56638C19.6873 8.35281 21 7.74603 21 6.75C21 5.75397 19.6873 5.14719 17.0618 3.93362L15.357 3.14559C13.7048 2.38186 12.8786 2 12 2C11.1214 2 10.2952 2.38186 8.64298 3.14559Z"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M20.788 11.0972C20.9293 11.2959 21 11.5031 21 11.7309C21 12.7127 19.6873 13.3109 17.0618 14.5072L15.357 15.284C13.7048 16.0368 12.8786 16.4133 12 16.4133C11.1214 16.4133 10.2952 16.0368 8.64298 15.284L6.93817 14.5072C4.31272 13.3109 3 12.7127 3 11.7309C3 11.5031 3.07067 11.2959 3.212 11.0972"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M20.3767 16.2661C20.7922 16.5971 21 16.927 21 17.3176C21 18.2995 19.6873 18.8976 17.0618 20.0939L15.357 20.8707C13.7048 21.6236 12.8786 22 12 22C11.1214 22 10.2952 21.6236 8.64298 20.8707L6.93817 20.0939C4.31272 18.8976 3 18.2995 3 17.3176C3 16.927 3.20778 16.5971 3.62334 16.2661"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const Search01Icon = ({
	color = "currentColor",
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={16}
		height={16}
		fill="none"
		color={color}
		{...props}
	>
		<path
			d="M17 17L21 21"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C15.4183 19 19 15.4183 19 11Z"
			stroke={stroke}
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const CheckIcon = ({
	stroke = "currentColor",
	...props
}: React.SVGProps<SVGSVGElement>) => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width={16}
		height={16}
		fill="none"
		stroke={stroke}
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		{...props}
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
);
