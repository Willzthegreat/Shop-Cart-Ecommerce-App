import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";


interface Props {
  className?: string;
  iconClassName?: string;
  tooltipClassName?: string;
}


const Sociallink = [
  {
    title: "YouTube",
    href: "https://www.youtube.com/@shopify",
    icon: <FaYoutube className="w-5 h-5" />,
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/shopify",
    icon: <FaFacebook className="w-5 h-5" />,
  },
  {
    title: "GitHub",
    href: "https://github.com/shopify",
    icon: <FaGithub className="w-5 h-5" />,
  },
  {
    title: "Twitter",
    href: "https://twitter.com/shopify",
    icon: <FaTwitter className="w-5 h-5" />,
  },
  {
    title: "LinkedIn",
    href: "https://www.linkedin.com/company/shopify",
    icon: <FaLinkedin className="w-5 h-5" />,
  },
];

const SocialMedia = ( { className, iconClassName, tooltipClassName }: Props ) => {
  return (
    <TooltipProvider>
      <div className={cn("flex items-center w-5 h-5 gap-6", className)}>
        {Sociallink.map((item) => (
          <Tooltip key={item?.title}>
            <TooltipTrigger >
              <Link href={item?.href} target="_blank" rel="noopener noreferrer" className={cn("px-4 py-2 mt-5 rounded-full hover:text-white hover:border-shop-light-green hoverEffect", iconClassName)}>
                {item?.icon}
              </Link>
            </TooltipTrigger>
            <TooltipContent className={cn("bg-white text-dark-color font-semibold border border-shop-light-green", tooltipClassName)}>
              <p>{item?.title}</p>
            </TooltipContent>
          </Tooltip>
          ))}
      </div>
    </TooltipProvider>
  )
}

export default SocialMedia;