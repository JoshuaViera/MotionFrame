'use client';

import { useMotionStore } from './store/useMotionStore';
import { Container } from './components/layout/Container';
import { PromptInput } from './components/workflow/PromptInput';
import { StyleSelector } from './components/workflow/StyleSelector';
import { GenerationView } from './components/workflow/GenerationView';
import { AnimationEditor } from './components/workflow/AnimationEditor';
import { ExportView } from './components/workflow/ExportView';
import { DirectorChat } from './components/workflow/DirectorChat';

export default function Home() {
  const currentStep = useMotionStore((state) => state.currentStep);

  return (
    <Container>
      {currentStep === 'prompt' && <PromptInput />}
      {currentStep === 'style' && <StyleSelector />}
      {currentStep === 'generation' && <GenerationView />}
      {currentStep === 'animation' && <AnimationEditor />}
      {currentStep === 'export' && <ExportView />}
      <DirectorChat />
    </Container>
  );
}