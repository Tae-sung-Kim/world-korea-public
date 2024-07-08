import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

type Product = {
  id: string;
  title: string;
  url: string;
  price: number;
};

const productItem: Product[] = [
  {
    id: '1',
    title: 'Ornella Binni',
    url: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
    price: 1000,
  },
  {
    id: '2',
    title: 'Tom Byrom',
    url: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
    price: 2000,
  },
  {
    id: '3',
    title: 'Vladimir Malyavko',
    url: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
    price: 3000,
  },
  {
    id: '4',
    title: 'Ornella Binni',
    url: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
    price: 1000,
  },
  {
    id: '5',
    title: 'Tom Byrom',
    url: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
    price: 2000,
  },
  {
    id: '6',
    title: 'Vladimir Malyavko',
    url: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
    price: 3000,
  },
  {
    id: '7',
    title: 'Ornella Binni',
    url: 'https://images.unsplash.com/photo-1465869185982-5a1a7522cbcb?auto=format&fit=crop&w=300&q=80',
    price: 1000,
  },
  {
    id: '8',
    title: 'Tom Byrom',
    url: 'https://images.unsplash.com/photo-1548516173-3cabfa4607e9?auto=format&fit=crop&w=300&q=80',
    price: 2000,
  },
  {
    id: '9',
    title: 'Vladimir Malyavko',
    url: 'https://images.unsplash.com/photo-1494337480532-3725c85fd2ab?auto=format&fit=crop&w=300&q=80',
    price: 3000,
  },
];

export default function Products() {
  return (
    <>
      <h1 className="pt-7 pb-10 text-center text-4xl font-medium">
        상품리스트
      </h1>
      <ScrollArea className={`h-dvh`}>
        {productItem.map((d) => (
          <div
            key={d.id}
            className="grid grid-rows-3 grid-flow-col-dense gap-2 m-5 p-5 rounded-md border"
          >
            <div className="row-span-3">
              <figure className="shrink-0 p-5 grid justify-items-center">
                <div className="overflow-hidden rounded-md size-48">
                  <Image
                    src={d.url}
                    alt={`Photo by ${d.title}`}
                    // className="aspet-[3/4] w-fit object-cover"
                    className="size-full"
                    width={300}
                    height={400}
                  />
                </div>
              </figure>
            </div>
            <div className="col-span-7 p-5">상품명: {d.title}</div>
            <div className="col-span-7 p-5 border-t">설명: {d.title}</div>
            <div className="col-span-7 p-5 border-t">가격: {d.price}원</div>
          </div>
        ))}
      </ScrollArea>
    </>
  );
}
