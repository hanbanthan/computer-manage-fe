import "./globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';


export const metadata = {
  title: "Computer Management"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
