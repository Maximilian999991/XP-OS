export type Messege = new (text: string) => {
	type: "ok" | "start" | "warn" | "error" | "log";
	time: number;
	sleep: number;
	text: string;

	toString(): string;

	ok(e?: string): void;
	warn(e?: string): void;
	error(e?: string): void;
	log(): void;
};

export type FileHandle = {
	writeFile: (path: string, content: string) => Promise<void>;
	readFile: (path: string) => Promise<string>;
	createFolder: (path: string) => Promise<void>;
	listFolder: (path: string) => Promise<
		{
			name: string;
			kind: "file" | "directory";
		}[]
	>;
	removeFolder: (path: string, recursive?: boolean) => Promise<void>;
};

export type Mouse = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	button: {
		pressed: boolean;
		down: boolean;
		up: boolean;
		x: number;
		y: number;
	};
	update: () => void;
};

export type KeyTypes = "Down" | "Up";
export type Keyboard = {
	press: never[];
	once(type: KeyTypes, func: (key: KeyboardEvent) => void): void;
	add(type: KeyTypes, func: (key: KeyboardEvent) => void): number;
	remove(i: number): void;
};
