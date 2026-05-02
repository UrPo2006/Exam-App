import { Brain, BookOpen, FileText, Code2 } from "lucide-react";
import image1 from "@/../public/imag/Vector.png"
import Image from "next/image";
export default function Navbar() {
  return (
    <section className="bg-regal-blue min-h-screen  flex items-center w-1/2">
      <div className="max-w-3xl mx-33 ">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-32">
          <div >
           <Image src={image1}  alt="Logo" width={40} height={40} />
          </div>
          <span className="text-blue-600 font-semibold text-lg">
            Exam App
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl  font-bold  font-inter text-gray-800 mb-15">
          Empower your learning journey
          <br />
          with our smart exam platform.
        </h1>

        {/* Features */}
        <div className="space-y-8 font-mono">

          {/* Feature 1 */}
          <div className="flex gap-5">
            <div className="mt-1.5 border-2 border-blue-600 p-1.5 rounded-md text-blue-600 w-9 h-9 ">
              <Brain size={22}/>
            </div>

            <div className="w-101 h-24">
              <h3 className="text-blue-600 font-semibold text-lg">
                Tailored Diplomas
              </h3>
              <p className="text-gray-700">
                Choose from specialized tracks like<br></br> Frontend, Backend,
                and Mobile <br></br>
                Development.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-5">
            <div className="mt-1.5 border-2 border-blue-600 p-1.5 rounded-md text-blue-600 w-9 h-9">
              <BookOpen size={22}/>
            </div>

          <div className="w-101 h-24">
              <h3 className="text-blue-600 font-semibold text-lg">
                Focused Exams
              </h3>
              <p className="text-gray-700">
                Access topic-specific tests including HTML, CSS,
                JavaScript, and more.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-5">
            <div className="mt-1.5 border-2 border-blue-600 p-1.5 rounded-md text-blue-600 w-9 h-9">
              <FileText size={22}/>
            </div>

            <div>
              <h3 className="text-blue-600 font-semibold text-lg">
                Smart Multi-Step Forms
              </h3>
              <p className="text-gray-700">
                Choose from specialized tracks like Frontend,
                Backend, and Mobile Development.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}