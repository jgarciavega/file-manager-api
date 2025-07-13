import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function BackToHomeButton() {
  return (
    <div className="w-full flex justify-center mt-8 mb-4">
      <Link href="/home" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-green-700 bg-green-100 hover:bg-green-200 hover:text-green-900 shadow transition-all duration-200">
        <FontAwesomeIcon icon={faArrowLeft} className="text-lg" />
        Volver al Inicio
      </Link>
    </div>
  );
}
