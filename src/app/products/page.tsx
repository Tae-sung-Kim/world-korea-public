import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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
      <h1>상품리스트</h1>
      <div className="">
        <ScrollArea className="whitespace-nowrap rounded-md border">
          {productItem.map((d) => (
            <div key={d.id} className="grid grid-rows-3 grid-flow-col gap-4">
              <div className="row-span-3">
                <figure className="shrink-0">
                  <div className="overflow-hidden rounded-md">
                    <Image
                      src={d.url}
                      alt={`Photo by ${d.title}`}
                      className="aspect-[3/4] h-fit w-fit object-cover"
                      width={300}
                      height={400}
                    />
                  </div>
                </figure>
              </div>
              <div className="col-span-2">상품명: {d.title}</div>
              <div className="row-span-2 col-span-2">가격: {d.price}원</div>
            </div>
          ))}
          <ScrollBar />
        </ScrollArea>
      </div>
    </>
  );
}
