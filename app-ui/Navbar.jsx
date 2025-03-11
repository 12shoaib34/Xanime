import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { MdColorLens } from "react-icons/md";

const Navbar = () => {
  return (
    <header className="bg-background-secondary">
      <div className="x-container grid grid-cols-12">
        <div className="col-span-2 flex items-center min-h-[64px]">
          <Link href="/">
            <h1 className="flex items-end text-4xl leading-none ">
              <span className="text-primary text-5xl font-extrabold relative top-0.5">X</span>anime
              <span className="text-primary text-base">
                <GoDotFill />
              </span>
            </h1>
          </Link>
        </div>
        <div className="col-span-8 hidden lg:block">
          <nav>
            <ul className="flex justify-center gap-12">
              <li>
                <Link className="p-5 block bg-primary text-font-color-primary" href="/">
                  Homepage
                </Link>
              </li>
              <li>
                <a className="p-5 block text-font-color-secondary" href="./categories.html">
                  Categories
                </a>
              </li>
              <li>
                <a className="p-5 block text-font-color-secondary" href="./blog.html">
                  Our Blog
                </a>
              </li>
              <li>
                <a className="p-5 block text-font-color-secondary" href="#">
                  Contacts
                </a>
              </li>
              <li>
                <Link className="p-5 flex gap-2" href="theme">
                  <MdColorLens className="text-primary" size={24} /> Theme
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
