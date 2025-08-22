import React, { Fragment } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function HeaderDropDownMenu() {
  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <RxHamburgerMenu className="h-8 w-8 cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="-translate-x-1/2 shadow">
          <DropdownMenuLabel className="font-bold italic">
            Sản Phẩm
          </DropdownMenuLabel>
          <DropdownMenuItem>Vải Thanh Hà</DropdownMenuItem>
          <DropdownMenuItem>Nước Cốt Vải</DropdownMenuItem>
          <DropdownMenuItem>Mật Ong</DropdownMenuItem>
          <DropdownMenuSeparator />

          <DropdownMenuLabel>
            <Link href={"/about"}>Giới Thiệu</Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="cursor-pointer">
            <Link href={"/support"}>Hỗ Trợ</Link>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </Fragment>
  );
}

export default HeaderDropDownMenu;
