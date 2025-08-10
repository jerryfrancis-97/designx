export interface DesignComponent {
  id: string;
  type: 'shape' | 'text' | 'slider' | 'button' | 'page';
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  content?: string;
  color: string;
  isSelected: boolean;
  isEditing: boolean;
  zIndex: number;
}

export interface ShapeComponent extends DesignComponent {
  type: 'shape';
  shapeType: 'rectangle' | 'circle' | 'triangle';
}

export interface TextComponent extends DesignComponent {
  type: 'text';
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  textAlign: 'left' | 'center' | 'right';
}

export interface SliderComponent extends DesignComponent {
  type: 'slider';
  minValue: number;
  maxValue: number;
  defaultValue: number;
}

export interface ButtonComponent extends DesignComponent {
  type: 'button';
  buttonText: string;
  buttonType: 'primary' | 'secondary' | 'outline';
}

export interface PageComponent extends DesignComponent {
  type: 'page';
  pageTitle: string;
  backgroundColor: string;
}

export type AnyComponent = ShapeComponent | TextComponent | SliderComponent | ButtonComponent | PageComponent;

export const DESIGN_COLORS = [
  '#F8F9FA', // Light gray
  '#E9ECEF', // Lighter gray
  '#DEE2E6', // Light blue-gray
  '#F1F3F4', // Very light blue
  '#F8F9FA'  // Off-white
];

export const COMPONENT_TYPES = [
  { type: 'shape', label: 'Shapes', icon: '🔷' },
  { type: 'text', label: 'Text', icon: '📝' },
  { type: 'slider', label: 'Slider', icon: '🎚️' },
  { type: 'button', label: 'Button', icon: '🔘' },
  { type: 'page', label: 'Page', icon: '📄' }
];
