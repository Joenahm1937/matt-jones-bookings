import { IFormProps } from "../Interfaces";
import { FaArrowLeft } from "react-icons/fa";
import { useGlobalStyles } from "../../GlobalContext";

export const Form = (props: IFormProps) => {
    const { onBack, showForm } = props;
    const { navHeight } = useGlobalStyles();
    return (
        <div className="flex h-screen w-full flex-col justify-center bg-white p-10 shadow-md">
            {showForm && <button
                type="button"
                onClick={onBack}
                className={`absolute left-0 top-[${navHeight}] m-5 rounded-full border border-gray-300 bg-white p-2`}
            >
                <FaArrowLeft size={24} />
            </button>}
            <h1 className="mb-5 text-2xl font-bold">Reservation Form</h1>
            <form>
                <div className="mb-4">
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="mt-1 w-full rounded-md border p-2"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Message
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        rows={4}
                        className="mt-1 w-full rounded-md border p-2"
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="rounded-md bg-blue-500 px-4 py-2 text-white"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};
