import Link from 'next/link';
import Image from 'next/image';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface PermissionCardProps {
  title: string;
  iconUrl?: string;
}

const Alert = ({ title, iconUrl }: PermissionCardProps) => {
  return (
    <section className="flex min-h-screen w-full items-center justify-center bg-slate-50 p-4 dark:bg-slate-900">
      <Card className="w-full max-w-md border-none shadow-2xl">
        <CardContent className="flex flex-col items-center gap-8 p-8">
          <div className="flex flex-col items-center gap-4 text-center">
            {iconUrl && (
              <div className="relative flex size-20 items-center justify-center rounded-full bg-slate-100 p-4 dark:bg-slate-800">
                <Image
                  src={iconUrl}
                  width={72}
                  height={72}
                  alt="icon"
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-xl font-semibold text-slate-950 dark:text-slate-50">
              {title}
            </p>
          </div>

          <Button asChild className="w-full" size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};

export default Alert;