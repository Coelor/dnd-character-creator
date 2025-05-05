interface BackgroundTabProps { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void; }
export default function BackgroundTab({ value, onChange }: BackgroundTabProps) {
    return (
        <>
            <label className="block mb-1 text-sm">Background</label>
            <input
                name="background"
                value={value}
                onChange={onChange}
                placeholder="Enter background"
                className="w-full p-2 border rounded"
            />
        </>
    );
}