import { LLM } from '@/lib/types/llm';
import { GetStaticProps } from 'next';
import React from 'react';

interface Props {
  llms: LLM[];
}

const LLMPage: React.FC<Props> = ({ llms }) => {
  return (
    <div>
      {llms.map((llm) => (
        <div key={llm.id}>
          <h3>{llm.name}</h3>
          <p>{llm.description}</p>
        </div>
      ))}
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await import('../public/llms.json');
  return {
    props: {
      llms: data.default
    },
  };
};

export default LLMPage;