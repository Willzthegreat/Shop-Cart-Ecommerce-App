import { cn } from "@/lib/utils/utils";

const Title = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h2 className={cn("text-2xl md:text-3xl font-bold font-sans text-shop-dark-green capitalize tracking-wide ", className)}>
      {children}
    </h2>
  );
};
const SubTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("text-gray-900 font-semibold font-sans", className)}>
      {children}
    </h3>
  );
};


const SubText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <p className={cn("text-gray-600 text-sm", className)}>{children}</p>
}

export {Title, SubText, SubTitle};