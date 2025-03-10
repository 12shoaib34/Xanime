import Image from "next/image";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-background-secondary">
      <div className="x-container grid grid-cols-12">
        <div className="col-span-2 flex items-center min-h-[64px]">
          <Link href="/">
            <Image src="/logo.png" alt="logo" width={92} height={23} priority />
          </Link>
        </div>
        <div className="col-span-10 hidden lg:block">
          <nav>
            <ul className="flex justify-center gap-12">
              <li>
                <Link className="p-5 block bg-primary" href="/">
                  Homepage
                </Link>
              </li>
              <li>
                <a className="p-5 block" href="./categories.html">
                  Categories
                </a>
              </li>
              <li>
                <a className="p-5 block" href="./blog.html">
                  Our Blog
                </a>
              </li>
              <li>
                <a className="p-5 block" href="#">
                  Contacts
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div className="col-span-2"></div>
      </div>
    </header>
  );
};

export default Navbar;
