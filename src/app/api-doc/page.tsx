import { getApiDocs } from '../api/swagger';
import ReactSwagger from './react-swagger';

export default async function SwaggerPage() {
  const spec = await getApiDocs();

  return (
    <div className="bg-white w-full">
      <section className="">
        <ReactSwagger spec={spec} />
      </section>
    </div>
  );
}
