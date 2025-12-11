import * as React from "react";

const Card = ({ className = "", ...props }: React.ComponentProps<"div">) => (
	<div
		className={`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm ${className}`}
		data-slot="card"
		{...props}
	/>
);

const CardAction = ({
	className = "",
	...props
}: React.ComponentProps<"div">) => (
	<div
		className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`}
		data-slot="card-action"
		{...props}
	/>
);

const CardContent = ({
	className = "",
	...props
}: React.ComponentProps<"div">) => (
	<div className={`px-6 ${className}`} data-slot="card-content" {...props} />
);

const CardDescription = ({
	className = "",
	...props
}: React.ComponentProps<"div">) => (
	<div
		className={`text-muted-foreground text-sm ${className}`}
		data-slot="card-description"
		{...props}
	/>
);

const CardFooter = ({
	className = "",
	...props
}: React.ComponentProps<"div">) => (
	<div
		className={`flex items-center px-6 [.border-t]:pt-6 ${className}`}
		data-slot="card-footer"
		{...props}
	/>
);

const CardHeader = ({
	className = "",
	...props
}: React.ComponentProps<"div">) => (
	<div
		className={`@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 ${className}`}
		data-slot="card-header"
		{...props}
	/>
);

const CardTitle = ({
	className = "",
	...props
}: React.ComponentProps<"div">) => (
	<div
		className={`leading-none font-semibold ${className}`}
		data-slot="card-title"
		{...props}
	/>
);

export {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
