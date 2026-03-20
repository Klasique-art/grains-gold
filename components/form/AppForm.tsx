"use client";

import { Form, Formik, FormikConfig, FormikValues } from "formik";
import type { ReactNode } from "react";

type AppFormProps<Values extends FormikValues> = {
  formStyles?: string;
  formId?: string;
  ariaLabel?: string;
  children: ReactNode;
} & FormikConfig<Values>;

const AppForm = <Values extends FormikValues>({
  initialValues,
  onSubmit,
  validationSchema,
  formStyles,
  formId,
  ariaLabel,
  children,
  ...rest
}: AppFormProps<Values>) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      {...rest}
    >
      <Form
        id={formId}
        aria-label={ariaLabel}
        className={`relative flex w-full flex-col gap-4 sm:gap-6 ${formStyles ?? ""}`.trim()}
      >
        {children}
      </Form>
    </Formik>
  );
};

export default AppForm;
